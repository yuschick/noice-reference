import { Nullable } from '@noice-com/utils';

import { AvatarData, TransformData } from 'api/types';

export interface LocatorGroup {
  groupIndex: number;
  teamId: Nullable<string>;
  slots: LocatorSlot[];
  userIds: Nullable<string>[];
}

export interface LocatorSlot {
  slotIndex: number;
  userId: Nullable<string>;
  transform: TransformData;
}

export class LocatorStack {
  private _groups: LocatorGroup[];

  private _useGroups: boolean;
  private _occupiedGroups: Map<string, number>;
  private _availableGroups: number[];

  constructor(groups: LocatorGroup[], useGroups: boolean) {
    this._groups = groups;
    this._useGroups = useGroups;

    this._occupiedGroups = new Map<string, number>();
    this._availableGroups = [];

    this.resetAllocations();
  }

  private _getOrCreateGroupData(groupId: string): LocatorGroup | undefined {
    if (!this._useGroups) {
      return this._groups[0];
    }

    let index = this._occupiedGroups.get(groupId) ?? -1;
    if (index === -1) {
      if (!this._tryAllocateGroupIndex((i) => (index = i))) {
        return;
      }

      this._groups[index].teamId = groupId;
      this._occupiedGroups.set(groupId, index);
    }

    return this._groups[index];
  }

  private _getGroupData(groupId: string): LocatorGroup | undefined {
    if (!this._useGroups) {
      return this._groups[0];
    }

    const index = this._occupiedGroups.get(groupId) ?? -1;
    if (index === -1) {
      return undefined;
    } else {
      return this._groups[index];
    }
  }

  private _tryAllocateGroupIndex(callback: (index: number) => void): boolean {
    if (this._availableGroups.length <= 0) {
      return false;
    }

    callback(this._availableGroups.shift() ?? -1);
    return true;
  }

  private _tryAllocateUserToGroup(
    userId: string,
    slotIndex: number,
    groupData: LocatorGroup,
  ): boolean {
    if (groupData.userIds.length <= slotIndex) {
      return false;
    }

    if (groupData.userIds[slotIndex] === userId) {
      return true;
    } else if (groupData.userIds[slotIndex] !== null) {
      return false;
    } else {
      groupData.userIds[slotIndex] = userId;
      return true;
    }
  }

  private _removeUserFromGroup(userId: string, groupData: LocatorGroup) {
    if (!groupData.userIds.includes(userId)) {
      return;
    }

    const index = groupData.userIds.indexOf(userId);
    groupData.userIds[index] = null;

    if (!groupData.userIds.some((s) => s !== null)) {
      if (groupData.teamId) {
        this._occupiedGroups.delete(groupData.teamId);
        this._availableGroups.push(groupData.groupIndex);
      }

      this._resetGroup(groupData);
    }
  }

  private _resetGroup(groupData: LocatorGroup) {
    groupData.teamId = null;
    groupData.userIds = Array(groupData.slots.length).fill(null);
  }

  // Resets all data set by avatar transform allocations
  // Note that we never reset the data set by the SceneBuilder
  public resetAllocations() {
    this._occupiedGroups = new Map<string, number>();
    this._availableGroups = [...Array(this._groups.length).keys()];

    this._groups.forEach((groupData) => {
      this._resetGroup(groupData);
    });
  }

  // Reserve a GroupData and set its teamId
  public reserveGroup(groupIndex: number, groupId: string) {
    this._availableGroups = this._availableGroups.filter((item) => item !== groupIndex);
    this._groups[groupIndex].teamId = groupId;
    this._occupiedGroups.set(groupId, groupIndex);
  }

  // Allocate an Avatar to the Locator Stack
  // If the Avatar already has an allocated Slot, it is returned
  // Otherwise we allocate a new Slot in a group with matching teamId
  // If no Avatars from this groupId have been allocated a new group is allocated
  public getOrAddAvatar(
    avatarData: AvatarData,
    overrideGroupId?: string,
    overrideSlotIndex?: number,
    generateSlotIndex = false,
  ): TransformData | undefined {
    const groupId = overrideGroupId ?? avatarData.groupId;
    let slotIndex = overrideSlotIndex ?? avatarData.slotIndex;
    const overrideAllSlotData = overrideGroupId && overrideSlotIndex;

    // Dont automatically allocate for any temporary avatars
    // We assume these to be manually assigned
    if (avatarData.temporaryFlag !== undefined && !overrideAllSlotData) {
      return undefined;
    }

    const groupData = this._getOrCreateGroupData(groupId);
    if (!groupData) {
      return;
    }

    if (generateSlotIndex) {
      let gotValidIndex = false;
      for (let i = 0; i < groupData.userIds.length; i++) {
        if (groupData.userIds[i] === null) {
          slotIndex = i;
          gotValidIndex = true;
          break;
        }
      }

      if (!gotValidIndex) {
        return;
      }
    }

    if (!this._tryAllocateUserToGroup(avatarData.userId, slotIndex, groupData)) {
      return;
    }

    const slot = groupData.slots[slotIndex];

    return slot.transform;
  }

  public removeAvatar(avatarData: AvatarData) {
    const groupData = this._getGroupData(avatarData.groupId);
    if (!groupData) {
      return;
    }

    const userId = avatarData.userId;
    this._removeUserFromGroup(userId, groupData);
  }
}
