import { gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';

import { useTriggerUIEvent } from '../../../hooks/SocialUIEvent.hook';

import {
  QueryPartyArgs,
  QueryUserPartyArgs,
  useCreatePartyInvitationMutation,
  useCreatePartyMutation,
  useLeavePartyMutation,
} from '@social-gen';
import { SocialUIEventType } from '@social-types';

export interface LeavePartyOptions {
  omitPlayerLeftEvent?: boolean;
}

interface HookResult {
  leaveParty(options?: LeavePartyOptions): Promise<void>;
  inviteToParty(friendId: string): Promise<void>;
}

gql`
  mutation LeaveParty($userId: ID!, $partyId: ID!) {
    deletePartyMember(userId: $userId, partyId: $partyId) {
      emptyTypeWorkaround
    }
  }
`;

gql`
  mutation CreateParty {
    createParty {
      id
    }
  }
`;

gql`
  mutation CreatePartyInvitation($inviterId: ID!, $inviteeId: ID!, $partyId: ID!) {
    createPartyInvitation(
      inviterId: $inviterId
      inviteeId: $inviteeId
      partyId: $partyId
    ) {
      partyId
    }
  }
`;

export function usePartyActions(partyId: Nullable<string>): HookResult {
  const { userId } = useAuthentication();

  const [leavePartyFunc] = useLeavePartyMutation({
    update(cache, _result, { variables }) {
      cache.modify({
        fields: {
          userParty(existing, { storeFieldName, fieldName }) {
            const { userId: userIdVariable } = getFieldsVariables<QueryUserPartyArgs>(
              storeFieldName,
              fieldName,
            );

            if (userIdVariable !== userId) {
              return existing;
            }

            return null;
          },
          party(existing, { storeFieldName, fieldName }) {
            const { partyId } = getFieldsVariables<QueryPartyArgs>(
              storeFieldName,
              fieldName,
            );

            if (partyId !== variables?.partyId) {
              return existing;
            }

            return null;
          },
        },
      });
    },
  });
  const [createParty] = useCreatePartyMutation({
    update(cache, result) {
      cache.modify({
        fields: {
          userParty() {
            return result.data?.createParty;
          },
        },
      });
    },
  });
  const [createPartyInvitation] = useCreatePartyInvitationMutation();

  const triggerUIEvent = useTriggerUIEvent();

  const leaveParty = useCallback(
    async (options?: LeavePartyOptions) => {
      if (!partyId || !userId) {
        return;
      }

      const { omitPlayerLeftEvent = false } = options ?? {};

      await leavePartyFunc({ variables: { userId, partyId } });

      if (!omitPlayerLeftEvent) {
        await triggerUIEvent(SocialUIEventType.PartyLeft);
      }
    },
    [leavePartyFunc, triggerUIEvent, userId, partyId],
  );

  const inviteToParty = useCallback(
    async (friendId: string) => {
      // if user is not part of a party, create new one
      let pId = partyId;

      if (!partyId) {
        const { data } = await createParty({
          variables: {},
        });

        if (!data?.createParty) {
          throw new Error('Creating a party failed');
        }

        pId = data.createParty.id;

        await triggerUIEvent(SocialUIEventType.PartyCreated);
      }

      if (!pId || !userId) {
        return;
      }

      // then send an invitation
      await createPartyInvitation({
        variables: {
          partyId: pId,
          inviterId: userId,
          inviteeId: friendId,
        },
      });
    },
    [partyId, userId, createParty, createPartyInvitation, triggerUIEvent],
  );

  return {
    leaveParty,
    inviteToParty,
  };
}
