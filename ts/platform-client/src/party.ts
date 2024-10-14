import {
  PartyService as PartyServicePb,
  PartyAdminService as PartyAdminServicePb,
  Party,
  PartyInvitation,
} from '@noice-com/schemas/party/party.pb';

import {
  IPartyService,
  IPartyAdminService,
  IRequestParamsProvider,
  SubService,
} from './types';

export class PartyAdminService extends SubService implements IPartyAdminService {
  constructor(provider: IRequestParamsProvider) {
    super(provider);
  }

  public async listParties(): Promise<Party[]> {
    const { parties } = await PartyAdminServicePb.ListParties(
      {},
      await this._getInitReq(),
    );

    return parties;
  }

  public async createParty(members: string[]): Promise<Party> {
    return await PartyAdminServicePb.CreateParty({ members }, await this._getInitReq());
  }

  public async deleteParty(partyId: string): Promise<void> {
    await PartyAdminServicePb.DeleteParty({ partyId }, await this._getInitReq());
  }
}

export class PartyService extends SubService implements IPartyService {
  public async createParty(inviteeIds: string[]): Promise<Party> {
    return await PartyServicePb.CreateParty({ inviteeIds }, await this._getInitReq());
  }

  public async createPartyInvitation(
    partyId: string,
    inviterId: string,
    inviteeId: string,
  ): Promise<PartyInvitation> {
    return await PartyServicePb.CreatePartyInvitation(
      { partyId, inviterId, inviteeId },
      await this._getInitReq(),
    );
  }

  public async createPartyMember(partyId: string, userId: string): Promise<void> {
    await PartyServicePb.CreatePartyMember({ partyId, userId }, await this._getInitReq());
  }

  public async deletePartyInvitation(partyId: string, userId: string): Promise<void> {
    await PartyServicePb.DeletePartyInvitation(
      { partyId, userId },
      await this._getInitReq(),
    );
  }

  public async deletePartyMember(partyId: string, userId: string): Promise<void> {
    await PartyServicePb.DeletePartyMember({ partyId, userId }, await this._getInitReq());
  }

  public async getParty(partyId: string): Promise<Party> {
    return await PartyServicePb.GetParty({ partyId }, await this._getInitReq());
  }

  public async getUserParty(userId: string): Promise<Party> {
    return await PartyServicePb.GetUserParty({ userId }, await this._getInitReq());
  }

  public async listReceivedPartyInvitations(userId: string): Promise<PartyInvitation[]> {
    const { invitations } = await PartyServicePb.ListReceivedPartyInvitations(
      { userId },
      await this._getInitReq(),
    );

    return invitations;
  }

  public async listSentPartyInvitations(userId: string): Promise<PartyInvitation[]> {
    const { invitations } = await PartyServicePb.ListSentPartyInvitations(
      { userId },
      await this._getInitReq(),
    );

    return invitations;
  }
}
