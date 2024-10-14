import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  IconButton,
  UsePopoverMenuResult,
  usePopoverMenu,
} from '@noice-com/common-ui';
import { useState, MouseEvent } from 'react';

import {
  ActiveSubscriptionMenu,
  ChargebeeSubscriptionModal,
  SubscriptionCancellationModal,
} from '@common/subscription';
import {
  SubscriptionButtonSubscriptionFragment,
  SubscriptionChannelSubscriptionState,
} from '@gen';

interface Props {
  subscription: SubscriptionButtonSubscriptionFragment;
  onButtonClick(event: MouseEvent<HTMLButtonElement>): void;
}

function SubButton({
  subscription,
  onButtonClick,
  popover,
  setShowSubscriptionModal,
}: Props & {
  popover: UsePopoverMenuResult;
  setShowSubscriptionModal(show: boolean): void;
}) {
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
  const { state, channel } = subscription;
  const onCancelSubscription = () => {
    setShowCancelSubscriptionModal(true);
  };
  const onClose = () => setShowCancelSubscriptionModal(false);

  if (state === SubscriptionChannelSubscriptionState.StateActive) {
    return (
      <>
        <IconButton
          icon={CoreAssets.Icons.Menu}
          label="Open subscription menu"
          level="secondary"
          ref={popover.state.popoverMenuTriggerRef}
          onClick={(event) => {
            popover.actions.toggle();
            onButtonClick(event);
          }}
        />

        <ActiveSubscriptionMenu
          store={popover}
          onCancelSubscription={onCancelSubscription}
        />

        {showCancelSubscriptionModal && (
          <SubscriptionCancellationModal
            channelId={channel.id}
            onClose={onClose}
          />
        )}
      </>
    );
  }

  if (
    !channel.subscriptionConfig?.subscriptionsEnabled ||
    !channel.monetizationSettings.enabled
  ) {
    return null;
  }

  return (
    <div>
      <Button
        size="sm"
        variant="cta"
        onClick={(event) => {
          setShowSubscriptionModal(true);
          onButtonClick(event);
        }}
      >
        Subscribe
      </Button>
    </div>
  );
}

export function SubscriptionButton({ subscription, onButtonClick }: Props) {
  const { channel } = subscription;
  const { id: channelId } = channel;

  const popover = usePopoverMenu({ placement: 'bottom-end' });

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <>
      <SubButton
        popover={popover}
        setShowSubscriptionModal={setShowSubscriptionModal}
        subscription={subscription}
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

SubscriptionButton.fragments = {
  entry: gql`
    fragment SubscriptionButtonSubscription on SubscriptionChannelSubscription {
      id
      state
      channel {
        id
        monetizationSettings {
          enabled
        }
        subscriptionConfig {
          channelId
          subscriptionsEnabled
        }
      }
    }
  `,
};
