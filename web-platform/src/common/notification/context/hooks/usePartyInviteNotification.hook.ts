import { gql } from '@apollo/client';
import { useParty } from '@noice-com/social';
import { useEffect, useRef } from 'react';

import { Context } from '../NotificationProvider';

import { PartyInviteNotificationContent } from '@common/notification/content';
import { PartyInviteNotificationContentProps } from '@common/notification/content/PartyInviteNotificationContent/PartyInviteNotificationContent';
import { AddNotificationResult } from '@common/notification/types';
import { useStreamGame } from '@common/stream';
import {
  usePartyInviterNotificationPartyLazyQuery,
  usePartyInviterNotificationProfileLazyQuery,
} from '@gen';

gql`
  query PartyInviterNotificationProfile($userId: ID!) {
    profile(userId: $userId) {
      ...PartyInviteNotificationContentLeaderProfile
    }
  }
  ${PartyInviteNotificationContent.fragments.party}
`;

gql`
  query PartyInviterNotificationParty($partyId: ID!) {
    party(partyId: $partyId) {
      ...PartyInviteNotificationContentParty
    }
  }
  ${PartyInviteNotificationContent.fragments.party}
`;

type Props = Pick<Context, 'actions'>;

type InviteToNotificationMapping = {
  partyId: string;
  notification: AddNotificationResult<PartyInviteNotificationContentProps>;
};

export function usePartyInviteNotification({ actions }: Props) {
  const mapping = useRef<InviteToNotificationMapping[]>([]);
  const { partyInvites, partyInviteErrorByPartyId, acceptInvite, declineInvite } =
    useParty();
  const { streamId } = useStreamGame();
  const { removeNotification, addNotification } = actions;
  const [fetchInviterProfile] = usePartyInviterNotificationProfileLazyQuery();
  const [fetchInviterParty] = usePartyInviterNotificationPartyLazyQuery();

  useEffect(() => {
    // Remove invites that no longer exist
    const removed = mapping.current.filter(
      (item) => !partyInvites.find((invite) => invite.partyId === item.partyId),
    );

    removed.forEach((mapping) => removeNotification(mapping.notification.id));

    const process = async () => {
      const result = await Promise.all(
        partyInvites.map(async (invite) => {
          const existingMapping = mapping.current.find(
            (item) => item.partyId === invite.partyId,
          );

          let notification = existingMapping ? existingMapping.notification : null;

          const { data: profileData } = await fetchInviterProfile({
            variables: { userId: invite.inviterId },
          });

          const { data: partyData } = await fetchInviterParty({
            variables: { partyId: invite.partyId },
          });

          if (!profileData?.profile || !partyData?.party) {
            return null;
          }

          const props = {
            partyLeader: profileData.profile,
            party: partyData.party,
            currentStreamId: streamId,
            error: partyInviteErrorByPartyId[invite.partyId],
          };

          if (!notification) {
            notification = addNotification({
              component: {
                type: PartyInviteNotificationContent,
                props: {
                  ...props,
                  onAccept: () => acceptInvite(invite.partyId),
                },
              },
              events: {
                onCloseClicked: () => declineInvite(invite.partyId),
              },
              options: {
                duration: 0,
              },
            });
          } else {
            notification.actions.update(props);
          }

          return { notification, partyId: invite.partyId };
        }),
      );

      mapping.current =
        (result.filter((result) => result !== null) as InviteToNotificationMapping[]) ??
        [];
    };

    process();
  }, [
    streamId,
    partyInvites,
    partyInviteErrorByPartyId,
    removeNotification,
    addNotification,
    fetchInviterProfile,
    fetchInviterParty,
    declineInvite,
    acceptInvite,
  ]);
}
