import { gql } from '@apollo/client';

import { Callout } from '@common/callout';
import { useMonetizationCalloutDataQuery } from '@gen';

interface Props {
  channelId: string;
}

gql`
  query MonetizationCalloutData($channelId: ID!) {
    channel(id: $channelId) {
      id
      monetizationSettings {
        channelId
        enabled
      }
    }
  }
`;

export const MonetizationCallout = ({ channelId }: Props) => {
  const { data } = useMonetizationCalloutDataQuery({
    variables: { channelId },
    fetchPolicy: 'network-only',
  });

  if (!data?.channel || data?.channel?.monetizationSettings.enabled) {
    return null;
  }

  return (
    <Callout
      buttonLabel="Channel settings"
      linkTo={`/channels/${channelId}/settings`}
      message="Channel monetization has been disabled. Enable monetization from channel settings to activate this feature."
      type="alert"
    />
  );
};
