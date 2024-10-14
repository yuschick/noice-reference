import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FlagListData, GroupData } from '../../types';
import { getNewOrder } from '../../utils';

interface Context {
  onFlagEnableToggle(enabled: boolean): void;
  onGroupUpdate(groupId: string, update: (groupData: GroupData) => GroupData): void;
  onFlagGroupAdd(): void;
  onFlagGroupRemove(groupId: string): void;
}

const FeatureFlagUpdateContext = createContext<Nullable<Context>>(null);

interface Props {
  flagsData: FlagListData;
  flagName: string;
  onUpdate(flags: FlagListData): void;
}

export const FeatureFlagUpdateProvider = ({
  children,
  flagsData,
  flagName,
  onUpdate,
}: WithChildren<Props>) => {
  const onFlagEnableToggle = (enabled: boolean) => {
    onUpdate({
      flags: {
        ...flagsData.flags,
        [flagName]: {
          ...flagsData.flags[flagName],
          enabled,
        },
      },
    });
  };

  const onGroupUpdate = (
    groupId: string,
    update: (groupData: GroupData) => GroupData,
  ) => {
    const flag = flagsData.flags[flagName];
    const group = flag.groups[groupId];

    onUpdate({
      flags: {
        ...flagsData.flags,
        [flagName]: {
          ...flag,
          groups: {
            ...flag.groups,
            [groupId]: update(group),
          },
        },
      },
    });
  };

  const onFlagGroupAdd = () => {
    const flag = flagsData.flags[flagName];
    const groupID = uuidv4();

    onUpdate({
      flags: {
        ...flagsData.flags,
        [flagName]: {
          ...flag,
          groups: {
            ...flag.groups,
            [groupID]: {
              id: groupID,
              enabled: false,
              default: false,
              values: {},
              conditions: {},
              order: getNewOrder(flag.groups),
            },
          },
        },
      },
    });
  };

  const onFlagGroupRemove = (groupId: string) => {
    const flag = flagsData.flags[flagName];
    const { [groupId]: _, ...groups } = flag.groups;

    onUpdate({
      flags: {
        ...flagsData.flags,
        [flagName]: {
          ...flag,
          groups,
        },
      },
    });
  };

  return (
    <FeatureFlagUpdateContext.Provider
      value={{ onFlagEnableToggle, onGroupUpdate, onFlagGroupAdd, onFlagGroupRemove }}
    >
      {children}
    </FeatureFlagUpdateContext.Provider>
  );
};

export const useFeatureFlagUpdate = () => {
  const context = useContext(FeatureFlagUpdateContext);

  if (!context) {
    throw new Error(
      'Trying to access feature flag update from context without FeatureFlagUpdateContext',
    );
  }

  return context;
};
