import { gql } from '@apollo/client';
import { FTUEActionType, useAnalytics, useTriggerFTUEAction } from '@noice-com/common-ui';
import { AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext } from '@noice-com/schemas/analytics/analytics.pb';
import { useState } from 'react';

import { useMatureRatedContentDialog } from '@common/channel';
import { JoinGameClickChannelFragment } from '@gen';
import { useChannelStream } from '@pages/Channel/context';

gql`
  fragment JoinGameClickChannel on ChannelChannel {
    id
    ...MatureRatedContentDialogChannel
  }
`;

interface Props {
  channel: JoinGameClickChannelFragment;
}

interface HookResult {
  joinGameButtonLoading: boolean;
  onJoinGameClick(): void;
}

export function useJoinGameClick({ channel }: Props): HookResult {
  const [joinGameButtonLoading, setJoinGameButtonLoading] = useState(false);

  const { trackEvent } = useAnalytics();
  const triggerFTUEAction = useTriggerFTUEAction();

  const { playSolo, joinStream } = useChannelStream();

  const { getWhatDialogShouldBeShown, onShowMatureRatedContentDialog } =
    useMatureRatedContentDialog();

  const onJoinGameClick = async () => {
    setJoinGameButtonLoading(true);

    trackEvent({
      clientSoloPlayToggle: {
        enabled: playSolo,
        context:
          AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext.SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW,
      },
    });

    const dialog = await getWhatDialogShouldBeShown({ channel, usedInChannelPage: true });

    if (!dialog) {
      await joinStream();
      setJoinGameButtonLoading(false);
      return;
    }

    await onShowMatureRatedContentDialog({
      dialog,
      channelId: channel.id,
      onJoinGame: async () => {
        triggerFTUEAction(FTUEActionType.ChannelJoinStreamClicked);
        await joinStream();
        setJoinGameButtonLoading(false);
      },
    });
  };

  return {
    joinGameButtonLoading,
    onJoinGameClick,
  };
}
