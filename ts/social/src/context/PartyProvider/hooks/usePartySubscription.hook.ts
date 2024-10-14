import { gql } from '@apollo/client';
import {
  useRestartingSubscription,
  variablesOrSkip,
} from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import {
  PartyInvitesPartyUpdatesDocument,
  PartyInvitesPartyUpdatesSubscription,
  PartyInvitesPartyUpdatesSubscriptionVariables,
  usePartyInvitesCurrentPartyQuery,
} from '@social-gen';

gql`
  query PartyInvitesCurrentParty($userId: ID!) {
    userParty(userId: $userId) {
      id
      leaderId
      streamId
      members {
        userId
      }
    }
  }
`;

gql`
  subscription PartyInvitesPartyUpdates($partyId: ID!) {
    partyUpdateSubscribe(partyId: $partyId) {
      party {
        id
        streamId
        leaderId
        members {
          userId
          profile {
            userId
          }
        }
        channel {
          id
        }
      }
    }
  }
`;

interface HookResult {
  partyId: Nullable<string>;
  partyStreamId: Nullable<string>;
  isPartyLeader: boolean;
  partyMemberAmount: number;
  partyMemberIds: string[];
  loading: boolean;
}

export function usePartySubscription(): HookResult {
  const { userId } = useAuthentication();

  const { data, loading } = usePartyInvitesCurrentPartyQuery({
    ...variablesOrSkip({ userId }),
  });
  const partyId = data?.userParty?.id ?? null;
  const leaderId = data?.userParty?.leaderId ?? null;
  const partyMemberAmount = data?.userParty?.members.length ?? 0;
  const partyStreamId = data?.userParty?.streamId ?? null;

  useRestartingSubscription<
    PartyInvitesPartyUpdatesSubscription,
    PartyInvitesPartyUpdatesSubscriptionVariables
  >(PartyInvitesPartyUpdatesDocument, {
    ...variablesOrSkip({ partyId }),
  });

  return {
    partyId,
    isPartyLeader: leaderId === userId,
    partyMemberAmount,
    loading,
    partyStreamId,
    partyMemberIds: data?.userParty?.members.map((member) => member.userId) ?? [],
  };
}
