import { gql } from '@apollo/client';

import { SubscriptionModalCompleteStageChannelFragment } from '@gen';

interface Props {
  channel: SubscriptionModalCompleteStageChannelFragment;
}

export function CompleteStage({ channel }: Props) {
  const { name } = channel;

  return (
    <section>
      <p>
        Thank you for your support and subscribing to {name}! The special channel perks
        are now available for you!
      </p>
    </section>
  );
}

CompleteStage.fragments = {
  entry: gql`
    fragment SubscriptionModalCompleteStageChannel on ChannelChannel {
      name
    }
  `,
};
