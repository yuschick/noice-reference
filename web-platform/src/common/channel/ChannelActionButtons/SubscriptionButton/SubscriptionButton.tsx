import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  AuthenticatedUserProvider,
  Button,
  UsePopoverMenuResult,
  useAuthentication,
  usePopoverMenu,
} from '@noice-com/common-ui';
import { useState, MouseEvent, ComponentProps } from 'react';

import styles from './SubscriptionButton.module.css';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import {
  ActiveSubscriptionMenu,
  ChargebeeSubscriptionModal,
  SubscriptionCancellationModal,
} from '@common/subscription';
import {
  SubscriptionButtonChannelFragment,
  SubscriptionChannelSubscriptionState,
} from '@gen';

gql`
  fragment SubscriptionButtonChannel on ChannelChannel {
    id
    following
    subscriptionConfig @skip(if: $skipAuthFields) {
      channelId
      subscriptionsEnabled
    }
    subscription @skip(if: $skipAuthFields) {
      id
      state
    }
    monetizationSettings @skip(if: $skipAuthFields) {
      enabled
    }
  }
`;

interface Props {
  channel: SubscriptionButtonChannelFragment;
  size: ComponentProps<typeof Button>['size'];
  skipPopovers?: boolean;
  onButtonClick(event: MouseEvent<HTMLButtonElement>): void;
}

function SubButton({
  channel,
  size,
  onButtonClick,
  popover,
  setShowNewSubscriptionModal,
  skipPopovers,
}: Props & {
  popover: UsePopoverMenuResult;
  setShowNewSubscriptionModal(show: boolean): void;
}) {
  const { userId } = useAuthentication();

  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
  const { subscriptionConfig, subscription, following, monetizationSettings } = channel;

  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.SubscribeChannel,
  );
  const onCancelSubscription = () => {
    setShowCancelSubscriptionModal(true);
  };
  const onClose = () => setShowCancelSubscriptionModal(false);

  if (subscription?.state === SubscriptionChannelSubscriptionState.StateActive) {
    return (
      <>
        <div className={styles.buttonWrapper}>
          <Button
            iconEnd={!skipPopovers ? CoreAssets.Icons.Menu : undefined}
            level="secondary"
            ref={popover.state.popoverMenuTriggerRef}
            size={size}
            onClick={(event) => {
              onButtonClick(event);
              if (skipPopovers) {
                onCancelSubscription();
                return;
              }
              popover.actions.toggle();
            }}
          >
            Subscribed
          </Button>

          <ActiveSubscriptionMenu
            store={popover}
            showManageSubscriptionsLink
            onCancelSubscription={onCancelSubscription}
          />
        </div>

        {showCancelSubscriptionModal && !!userId && (
          <AuthenticatedUserProvider userId={userId}>
            <SubscriptionCancellationModal
              channelId={channel.id}
              onClose={onClose}
            />
          </AuthenticatedUserProvider>
        )}
      </>
    );
  }

  if (!subscriptionConfig?.subscriptionsEnabled || !monetizationSettings?.enabled) {
    return null;
  }

  return (
    <Button
      level={following ? 'primary' : 'secondary'}
      size={size}
      onClick={(event) => {
        onAction(() => {
          setShowNewSubscriptionModal(true);
          onButtonClick(event);
        });
      }}
    >
      Subscribe
    </Button>
  );
}

export function SubscriptionButton({
  channel,
  size,
  onButtonClick,
  skipPopovers,
}: Props) {
  const popover = usePopoverMenu({ placement: 'bottom-end' });

  const { id: channelId } = channel;

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <>
      <SubButton
        channel={channel}
        popover={popover}
        setShowNewSubscriptionModal={setShowSubscriptionModal}
        size={size}
        skipPopovers={skipPopovers}
        onButtonClick={onButtonClick}
      />

      {showSubscriptionModal && (
        <ChargebeeSubscriptionModal
          channelId={channelId}
          handleModalCloseCallback={() => setShowSubscriptionModal(false)}
        />
      )}
    </>
  );
}
