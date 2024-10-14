import { gql } from '@apollo/client';
import { useAuthentication } from '@noice-com/common-ui';
import { MouseEvent } from 'react';
import { LinkProps, useNavigate } from 'react-router-dom';

import { useMatureRatedContentDialog } from '../context';

import { ChannelAutoJoinLinkPropsChannelFragment } from '@gen';

gql`
  fragment ChannelAutoJoinLinkPropsChannel on ChannelChannel {
    id
    name
    ...MatureRatedContentDialogChannel
  }
`;

interface Props {
  channel: ChannelAutoJoinLinkPropsChannelFragment;
  onClick?: LinkProps['onClick'];
}

export function useChannelAutoJoinLinkProps({
  channel,
  onClick: onClickProp,
}: Props): Pick<LinkProps, 'to' | 'onClick' | 'state'> {
  const { name, id: channelId } = channel;

  const { userId } = useAuthentication();
  const navigate = useNavigate();
  const { getWhatDialogShouldBeShown, onShowMatureRatedContentDialog } =
    useMatureRatedContentDialog();

  const to = `/${name.toLowerCase()}`;

  const onClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    onClickProp?.(event);

    if (!userId) {
      return;
    }

    event.preventDefault();

    const dialog = await getWhatDialogShouldBeShown({
      channel,
      usedInChannelPage: false,
    });

    if (!dialog) {
      navigate(to);
      return;
    }

    await onShowMatureRatedContentDialog({
      dialog,
      channelId,
      onJoinGame: async () => {
        navigate(to, {
          state: {
            ignoreMatureRatedWarningDialog: true,
          },
        });
      },
    });
  };

  return { to, onClick };
}
