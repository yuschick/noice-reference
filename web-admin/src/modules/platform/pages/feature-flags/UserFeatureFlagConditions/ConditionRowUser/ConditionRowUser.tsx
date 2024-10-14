import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { generatePath } from 'react-router-dom';

import styles from './ConditionRowUser.module.css';

import { PermissionLink } from '@common/permission';
import { useFeatureFlagUserConditionProfileQuery } from '@gen';

gql`
  query FeatureFlagUserConditionProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      ...ProfileImageProfile
    }
  }
`;

interface Props {
  userId: string;
}

export function ConditionRowUser({ userId }: Props) {
  const { data } = useFeatureFlagUserConditionProfileQuery({
    variables: {
      userId,
    },
  });

  if (!data?.profile) {
    return <span>{userId}</span>;
  }

  return (
    <PermissionLink
      className={styles.profileLink}
      to={generatePath(`/users/:userId`, { userId })}
    >
      <ProfileImage
        profile={data.profile}
        size="xs"
      />

      {data.profile.userTag}
    </PermissionLink>
  );
}
