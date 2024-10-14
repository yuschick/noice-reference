import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';

import { PlatformSuspensionAppealForm } from '../common';

import { useDrawer } from '@common/drawer';
import { usePlatformSuspensionAppealDrawerQuery } from '@gen';

gql`
  query PlatformSuspensionAppealDrawer($userId: ID!) {
    platformBan(userId: $userId) {
      banId
      ...PlatformSuspensionAppealFormSuspension
    }

    profile(userId: $userId) {
      userId
      ...PlatformSuspensionAppealFormProfile
    }
  }
`;

interface Props {
  refetchTable(): void;
}

export function PlatformSuspensionAppealDrawer({ refetchTable }: Props) {
  const { activeId, closeDrawer } = useDrawer();

  const { data } = usePlatformSuspensionAppealDrawerQuery({
    ...variablesOrSkip({ userId: activeId }),
    onCompleted(data) {
      if (!data.platformBan) {
        refetchTable();
        closeDrawer();
        // @todo add some toast error saying that appeal was not found
      }
    },
  });

  if (!data || !data.platformBan || !data.profile) {
    return null;
  }

  return (
    <PlatformSuspensionAppealForm
      platformSuspension={data.platformBan}
      profile={data.profile}
      onSubmit={closeDrawer}
    />
  );
}
