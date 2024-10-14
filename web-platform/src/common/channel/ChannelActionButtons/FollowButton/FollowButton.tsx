import { gql } from '@apollo/client';
import {
  AuthenticatedUserProvider,
  Button,
  ButtonLink,
  ConfirmDialog,
  useAnalytics,
  useAuthentication,
  useConfirmDialog,
} from '@noice-com/common-ui';
import { ComponentProps, MouseEvent } from 'react';

import { useFollowChannelMutation, useUnfollowChannelMutation } from '../../hooks';

import { FollowingButton } from './FollowingButton/FollowingButton';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { FollowButtonChannelFragment } from '@gen';

gql`
  fragment FollowButtonChannel on ChannelChannel {
    id
    name
    following
  }
`;

interface Props {
  buttonSize: ComponentProps<typeof ButtonLink>['size'];
  channel: FollowButtonChannelFragment;
  skipPopover?: boolean;
  onButtonClick(event: MouseEvent<HTMLButtonElement>): void;
}

export const FollowButton = ({
  channel,
  onButtonClick,
  buttonSize,
  skipPopover,
}: Props) => {
  const { userId } = useAuthentication();

  const { trackButtonClickEvent } = useAnalytics();

  const [unfollowChannel] = useUnfollowChannelMutation();

  const [followChannel] = useFollowChannelMutation();

  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.FollowChannel,
  );

  const unfollowConfirmStore = useConfirmDialog({
    title: `Unfollow ${channel.name}`,
    description: "You'll no longer receive notifications from this channel.",
    onConfirm: [
      () => {
        if (!userId) {
          return;
        }

        trackButtonClickEvent('confirm-unfollow', { section: 'unfollow-channel' });
        unfollowChannel({ variables: { channelId: channel.id, userId } });
      },
      {
        label: 'Unfollow',
      },
    ],
    onCancel: () => {},
  });

  const onFollowClick = (event: MouseEvent<HTMLButtonElement>) => {
    onAction(() => {
      if (!userId) {
        return;
      }

      followChannel({ variables: { channelId: channel.id, userId } });
      onButtonClick(event);
    });
  };

  return (
    <>
      {channel.following && userId ? (
        <AuthenticatedUserProvider userId={userId}>
          <FollowingButton
            channelId={channel.id}
            size={buttonSize}
            skipPopovers={skipPopover}
            onButtonClick={onButtonClick}
            onUnfollowClick={() => unfollowConfirmStore.actions.open()}
          />
        </AuthenticatedUserProvider>
      ) : (
        <Button
          level="primary"
          size={buttonSize}
          onClick={onFollowClick}
        >
          Follow
        </Button>
      )}

      <ConfirmDialog store={unfollowConfirmStore} />
    </>
  );
};
