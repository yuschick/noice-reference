import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import {
  StreamSpectatorCoordinationSubscribeDocument,
  StreamSpectatorCoordinationSubscribeSubscription,
  StreamSpectatorCoordinationSubscribeSubscriptionVariables,
} from '@common-gen';

interface HookResult {
  groupID: Nullable<string>;
}

gql`
  subscription StreamSpectatorCoordinationSubscribe($streamId: ID!) {
    streamSpectatorCoordinationEventsSubscribe(streamId: $streamId) {
      event {
        ... on MatchStreamSpectatorChangeGroupEvent {
          groupId
        }
      }
    }
  }
`;

export function useSpectatorCoordination(streamId: Nullable<string>): HookResult {
  const [groupID, setGroupID] = useState<Nullable<string>>(null);

  useRestartingSubscription<
    StreamSpectatorCoordinationSubscribeSubscription,
    StreamSpectatorCoordinationSubscribeSubscriptionVariables
  >(StreamSpectatorCoordinationSubscribeDocument, {
    ...variablesOrSkip({ streamId }),
    onData: ({ data: { data } }) => {
      if (!data?.streamSpectatorCoordinationEventsSubscribe) {
        return;
      }

      const event = data.streamSpectatorCoordinationEventsSubscribe.event;

      if (!event) {
        return;
      }

      if (event.__typename === 'MatchStreamSpectatorChangeGroupEvent') {
        setGroupID(event.groupId);
      }
    },
  });

  return {
    groupID: groupID,
  };
}
