import { CommonUIEvents, CommonUIEventType } from '@noice-com/common-ui';

export enum SocialEventType {
  PartyCreated = 'party.created',
  PartyLeft = 'party.left',
  PartyInvitationAccepted = 'party.invitationAccepted',
}

export type SocialUIEventType = SocialEventType | CommonUIEventType;
export const SocialUIEventType = {
  ...SocialEventType,
  ...CommonUIEventType,
};

export interface SocialUIEvents extends CommonUIEvents {
  [SocialEventType.PartyCreated]: [];
  [SocialEventType.PartyLeft]: [];
  [SocialEventType.PartyInvitationAccepted]: [partyId: string];
}
