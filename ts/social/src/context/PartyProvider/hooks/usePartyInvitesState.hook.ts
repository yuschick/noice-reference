import { gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import {
  PartyInvitationUpdateEvent,
  PartyInvitationUpdateEventUpdateType,
} from '@noice-com/schemas/party/party.pb';
import { useCallback, useEffect, useState } from 'react';

import { useTriggerUIEvent } from '../../../hooks/SocialUIEvent.hook';

import {
  QueryUserPartyArgs,
  usePartyInvitesCreatePartyMemberMutation,
  usePartyInvitesDeletePartyInviteMutation,
} from '@social-gen';
import { PartyInviteError, SocialUIEventType } from '@social-types';

interface PartyInviteType {
  partyId: string;
  inviterId: string;
}

gql`
  mutation PartyInvitesCreatePartyMember($userId: ID!, $partyId: ID!) {
    createPartyMember(userId: $userId, partyId: $partyId) {
      emptyTypeWorkaround
    }
  }
`;

gql`
  mutation PartyInvitesDeletePartyInvite($userId: ID!, $partyId: ID!) {
    deletePartyInvitation(userId: $userId, partyId: $partyId) {
      emptyTypeWorkaround
    }
  }
`;

interface HookResult {
  partyInvites: PartyInviteType[];
  partyInviteErrorByPartyId: Record<string, PartyInviteError>;
  acceptInvite: (partyId: string) => Promise<void>;
  declineInvite: (partyId: string) => Promise<void>;
}

export function usePartyInvitesState(): HookResult {
  const { userId } = useAuthentication();
  const client = useClient();

  const [partyInvites, setPartyInvites] = useState<PartyInviteType[]>([]);
  const [partyInviteErrorByPartyId, setPartyInviteErrorByPartyId] = useState<
    Record<string, PartyInviteError>
  >({});

  const removeInvite = useCallback(
    (partyId: string) =>
      setPartyInvites((cur) => cur.filter((inv) => inv.partyId !== partyId)),
    [],
  );

  const [createPartyMember] = usePartyInvitesCreatePartyMemberMutation();
  const [deletePartyInvite] = usePartyInvitesDeletePartyInviteMutation();

  const triggerUIEvent = useTriggerUIEvent();

  const acceptInvite = useCallback(
    async (partyId: string) => {
      if (!userId) {
        return;
      }

      await createPartyMember({
        variables: {
          partyId,
          userId,
        },
        onError: (errors) => {
          const [error] = errors.graphQLErrors;
          const partyInviteError = error.message.includes('party is already full')
            ? PartyInviteError.PartyFull
            : PartyInviteError.UnknownIssue;

          setPartyInviteErrorByPartyId((cur) => {
            cur[partyId] = partyInviteError;
            return Object.assign({}, cur);
          });
        },
        onCompleted: async () => {
          removeInvite(partyId);
          setPartyInviteErrorByPartyId((cur) => {
            delete cur[partyId];
            return Object.assign({}, cur);
          });

          await triggerUIEvent(SocialUIEventType.PartyInvitationAccepted, partyId);
        },
        update(cache, _result, { variables }) {
          cache.modify({
            fields: {
              userParty(existing, { storeFieldName, fieldName }) {
                const { userId: userIdVariable } = getFieldsVariables<QueryUserPartyArgs>(
                  storeFieldName,
                  fieldName,
                );

                if (userIdVariable !== userId || !variables?.partyId) {
                  return existing;
                }

                return {
                  id: variables.partyId,
                };
              },
            },
          });
        },
      });
    },
    [createPartyMember, userId, removeInvite, triggerUIEvent],
  );

  const declineInvite = useCallback(
    async (partyId: string) => {
      if (!userId) {
        return;
      }

      await deletePartyInvite({
        variables: {
          partyId,
          userId,
        },
        onCompleted: async () => {
          removeInvite(partyId);
          setPartyInviteErrorByPartyId((cur) => {
            delete cur[partyId];
            return Object.assign({}, cur);
          });
        },
      });
    },
    [userId, deletePartyInvite, removeInvite],
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const handlePartyInvite = async (msg: PartyInvitationUpdateEvent) => {
      const partyId = msg.partyInvitation?.partyId;
      const inviterId = msg.partyInvitation?.inviterId;

      if (!partyId) {
        return;
      }

      if (!inviterId) {
        return;
      }

      setPartyInvites((current) => {
        if (
          current.find((invite) => invite.partyId === partyId) &&
          current.find((invite) => invite.inviterId === inviterId)
        ) {
          return current;
        }

        return [...current, { partyId, inviterId }];
      });
    };

    const handlePartyInviteDeleted = (msg: PartyInvitationUpdateEvent) => {
      const partyId = msg.partyInvitation?.partyId;
      const inviterId = msg.partyInvitation?.inviterId;

      if (!partyId) {
        return;
      }

      if (!inviterId) {
        return;
      }

      setPartyInvites((current) =>
        current.filter(
          (inv) => !(inv.partyId === partyId && inv.inviterId === inviterId),
        ),
      );
    };

    return client.NotificationService.notifications({
      async onPartyInvitationUpdate(_ctx, ev) {
        if (
          ev.type === PartyInvitationUpdateEventUpdateType.UPDATE_TYPE_INVITATION_CREATED
        ) {
          await handlePartyInvite(ev);
          return;
        }

        if (
          ev.type === PartyInvitationUpdateEventUpdateType.UPDATE_TYPE_INVITATION_DELETED
        ) {
          handlePartyInviteDeleted(ev);
          return;
        }
      },
    });
  }, [userId, client.NotificationService]);

  return {
    partyInvites,
    partyInviteErrorByPartyId,
    acceptInvite,
    declineInvite,
  };
}
