import { gql } from '@apollo/client';
import {
  AuthenticatedUserProvider,
  ButtonLink,
  useAuthentication,
} from '@noice-com/common-ui';
import { GiftSubscriptionToCommunityButton } from '@noice-com/social';
import { ComponentProps, MouseEvent } from 'react';

import styles from './ChannelActionButtons.module.css';
import { SubscriptionButton } from './SubscriptionButton/SubscriptionButton';

import { FollowButton } from '@common/channel/ChannelActionButtons/FollowButton';
import { ChannelActionButtonsChannelFragment } from '@gen';

gql`
  fragment ChannelActionButtonsChannel on ChannelChannel {
    id
    streamerId
    name
    following
    ...SubscriptionButtonChannel
    ...FollowButtonChannel
  }
`;

interface Props {
  channel: ChannelActionButtonsChannelFragment;
  buttonSize: ComponentProps<typeof ButtonLink>['size'];
  skipPopovers?: boolean;
  onButtonClick(event: MouseEvent<HTMLButtonElement>): void;
}

export function ChannelActionButtons({
  channel,
  onButtonClick,
  buttonSize,
  skipPopovers,
}: Props) {
  const { userId } = useAuthentication();

  const { id: channelId, streamerId, name } = channel;

  if (streamerId === userId) {
    return (
      <ButtonLink
        fit="content"
        level="secondary"
        size={buttonSize}
        to={`${NOICE.STUDIO_URL}/${name.toLowerCase()}/settings/channel`}
      >
        Customize channel
      </ButtonLink>
    );
  }

  return (
    <>
      <div className={styles.buttons}>
        <FollowButton
          buttonSize={buttonSize}
          channel={channel}
          skipPopover={skipPopovers}
          onButtonClick={onButtonClick}
        />

        <SubscriptionButton
          channel={channel}
          size={buttonSize}
          skipPopovers={skipPopovers}
          onButtonClick={onButtonClick}
        />

        {!!userId && (
          <AuthenticatedUserProvider userId={userId}>
            <GiftSubscriptionToCommunityButton
              channelId={channelId}
              className={styles.giftButton}
              level="secondary"
              size={buttonSize}
              title="Gift"
            />
          </AuthenticatedUserProvider>
        )}
      </div>
    </>
  );
}
