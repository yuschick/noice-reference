import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import {
  LeavePartyOptions,
  usePartyActions,
  usePartyInvitesState,
  usePartySubscription,
} from './hooks';

import { PartyInviteError } from '@social-types';

interface PartyInvite {
  partyId: string;
  inviterId: string;
}

interface Context {
  partyId: Nullable<string>;
  partyStreamId: Nullable<string>;
  partyMemberAmount: number;
  partyMemberIds: string[];
  loading: boolean;
  isPartyLeader: boolean;
  inParty: boolean;
  partyInvites: PartyInvite[];
  partyInviteErrorByPartyId: Record<string, PartyInviteError>;
  leaveParty: (options?: LeavePartyOptions) => Promise<void>;
  inviteToParty: (friendId: string) => Promise<void>;
  acceptInvite: (partyId: string) => Promise<void>;
  declineInvite: (partyId: string) => Promise<void>;
}

const PartyContext = createContext<Context | null>(null);

export function PartyProvider({ children }: WithChildren) {
  const { partyInvites, partyInviteErrorByPartyId, acceptInvite, declineInvite } =
    usePartyInvitesState();
  const {
    partyId,
    isPartyLeader,
    loading,
    partyMemberAmount,
    partyStreamId,
    partyMemberIds,
  } = usePartySubscription();
  const { leaveParty, inviteToParty } = usePartyActions(partyId);

  return (
    <PartyContext.Provider
      value={{
        partyId,
        isPartyLeader,
        partyInvites,
        loading,
        partyMemberAmount,
        partyStreamId,
        inParty: !!partyId,
        partyInviteErrorByPartyId,
        inviteToParty,
        leaveParty,
        acceptInvite,
        declineInvite,
        partyMemberIds,
      }}
    >
      {children}
    </PartyContext.Provider>
  );
}

export const useParty = (): Context => {
  const context = useContext(PartyContext);

  if (!context) {
    throw new Error('Trying to access party from context without PartyProvider');
  }

  return context;
};

export function MockPartyProvider({ children }: WithChildren) {
  return (
    <PartyContext.Provider
      value={{
        partyId: null,
        isPartyLeader: false,
        partyInvites: [],
        loading: false,
        partyMemberAmount: 0,
        partyStreamId: null,
        inParty: false,
        partyInviteErrorByPartyId: {},
        partyMemberIds: [],
        inviteToParty: () => Promise.resolve(),
        leaveParty: () => Promise.resolve(),
        acceptInvite: () => Promise.resolve(),
        declineInvite: () => Promise.resolve(),
      }}
    >
      {children}
    </PartyContext.Provider>
  );
}
