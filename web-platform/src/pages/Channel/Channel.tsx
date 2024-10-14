import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useConditionalOnce, useMountEffect } from '@noice-com/common-react-core';
import {
  useAnalytics,
  useConversionEvents,
  useKeyContentLoadTracker,
  useKeyContentLoadMetadata,
  useAuthentication,
} from '@noice-com/common-ui';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router';

import { ChannelPage } from './ChannelPage/ChannelPage';
import { ChannelPageContent } from './ChannelPageContent';
import { ChannelWrapper } from './ChannelWrapper';
import {
  useChannelStoreLinkStreamView,
  useChannelStreamAutoJoin,
  useChannelStreamStatus,
  useChannelSubscription,
  useOfflineChannelBan,
} from './hooks';

import { useRecentlyVisitedChannelIds } from '@common/channel';
import { Routes } from '@common/route';
import { StreamViewState, useSpectatorModeEnabled, useStreamState } from '@common/stream';
import { MicroSurveyEvent, useMicroSurveys, useSelectedUIState } from '@context';
import {
  ChannelLiveStatus,
  ChannelPageEntryChannelQueryVariables,
  useChannelPageEntryChannelQuery,
} from '@gen';
import { NotFound } from '@pages/NotFound';

gql`
  query ChannelPageEntryChannel($channelName: String!, $skipAuthFields: Boolean!) {
    channelByName(name: $channelName) {
      id
      name
      currentStreamId
      userBanStatus @skip(if: $skipAuthFields) {
        banned
      }
      liveStatus
      ...ChannelStreamStateChannel
      ...ChannelStreamAutoJoinChannel
    }
  }
`;

export function Channel() {
  const { userId } = useAuthentication();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const { channelName } = useParams();
  const enableSpectatorMode = useSpectatorModeEnabled();
  const { streamViewState } = useStreamState();
  const { sendBasicConversionEvent } = useConversionEvents();
  const setKeyContentMetadata = useKeyContentLoadMetadata();
  const { sendEvent } = useMicroSurveys();

  useMountEffect(() => {
    sendBasicConversionEvent('ChannelPageView');
  });

  const { onChannelDataCompleted, isTryingToAutoJoinGame } = useChannelStreamAutoJoin();
  useChannelStoreLinkStreamView();

  const { data, loading } = useChannelPageEntryChannelQuery({
    ...variablesOrSkip<ChannelPageEntryChannelQueryVariables>({
      channelName,
      skipAuthFields: !userId,
    }),
    onCompleted(data) {
      if (data.channelByName?.liveStatus === ChannelLiveStatus.LiveStatusOffline) {
        sendEvent(MicroSurveyEvent.UserLandedOnOfflineChannel, {});
      }

      if (data.channelByName?.userBanStatus?.banned) {
        navigate(generatePath(Routes.ChannelBan, { channelId: data.channelByName.id }), {
          replace: true,
        });
        return;
      }

      onChannelDataCompleted(data);
    },
  });

  useOfflineChannelBan(data?.channelByName?.id ?? null);
  useChannelStreamStatus({
    channel: data?.channelByName ?? null,
  });

  useChannelSubscription({
    channelId: data?.channelByName?.id,
  });

  const channel = data?.channelByName ?? null;

  const [, addChannelId] = useRecentlyVisitedChannelIds();
  const { setSelectedChannel } = useSelectedUIState();

  useConditionalOnce(() => {
    if (!data) {
      return;
    }

    trackEvent({
      clientChannelPageRendered: {
        channelId: data.channelByName?.id,
        streamId: data.channelByName?.currentStreamId,
        isLive: data.channelByName?.liveStatus === ChannelLiveStatus.LiveStatusLive,
      },
    });

    setKeyContentMetadata(
      'channel_live',
      (data.channelByName?.liveStatus === ChannelLiveStatus.LiveStatusLive).toString(),
    );
    setKeyContentMetadata('channel_id', data.channelByName?.id ?? '');
  }, !!data);

  useEffect(() => {
    if (!channel?.id) {
      return;
    }

    setSelectedChannel(channel.id);
    addChannelId(channel.id);
  }, [setSelectedChannel, addChannelId, channel?.id]);

  useKeyContentLoadTracker('channel_page', loading);

  // We don't want to show channel page content or loading when trying to auto join a game
  // @todo: when there is loading state that matches with auto join flow, that should be shown here
  if (isTryingToAutoJoinGame) {
    return <ChannelWrapper channelName={channel?.name ?? null} />;
  }

  if (loading) {
    return (
      <ChannelWrapper channelName={channel?.name ?? null}>
        <ChannelPageContent.Loading />
      </ChannelWrapper>
    );
  }

  if (!channel) {
    return <NotFound />;
  }

  // We don't want to show channel page content in spectator mode or in full stream mode
  if (enableSpectatorMode || streamViewState === StreamViewState.Full) {
    return <ChannelWrapper channelName={channel?.name ?? null} />;
  }

  return (
    <ChannelWrapper channelName={channel?.name ?? null}>
      <ChannelPage channelId={channel.id} />
    </ChannelWrapper>
  );
}
