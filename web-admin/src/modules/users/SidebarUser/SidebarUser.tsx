import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useParams } from 'react-router';

import styles from './SidebarUser.module.css';

import { ExternalButtonLink } from '@common/button';
import { generateUserPlatformLink } from '@common/external-links';
import { PermissionWrapper, useUserPermissions } from '@common/permission';
import { ContextualSidebarWrapperProps } from '@common/sidebar';
import { ApiEntityState, AuthPlatformRole, useSidebarUserQuery } from '@gen';

gql`
  query SidebarUser($userId: ID!, $skipBan: Boolean = false) {
    profile(userId: $userId) {
      userId
      userTag
      isNewUsername
      account {
        state
      }

      ...ProfileImageProfile
    }

    platformBan(userId: $userId) @skip(if: $skipBan) {
      banId
    }
  }
`;

export function SidebarUser({ children, className }: ContextualSidebarWrapperProps) {
  const { userId } = useParams();
  const { hasPermissionFromArray } = useUserPermissions();

  const { data } = useSidebarUserQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: userId!,
      skipBan: !hasPermissionFromArray([
        AuthPlatformRole.PlatformRoleAdmin,
        AuthPlatformRole.PlatformRoleModerator,
      ]),
    },
    skip: !userId,
  });

  return (
    <section className={classNames(className, styles.wrapper)}>
      {data?.profile && (
        <div className={styles.topWrapper}>
          <ProfileImage profile={data.profile} />

          <div className={styles.userTagWrapper}>
            <span className={styles.userTag}>{data.profile.userTag}</span>

            {!!data?.platformBan?.banId && (
              <span className={styles.userSuspendedTag}>Suspended</span>
            )}

            {data.profile?.account?.state === ApiEntityState.EntityStateDeleted && (
              <span className={styles.userSuspendedTag}>Deleted</span>
            )}

            {data.profile.isNewUsername && (
              <span className={styles.newUsername}>Username changed recently</span>
            )}
          </div>
        </div>
      )}

      {children}

      <div className={styles.bottomWrapper}>
        {data?.profile && (
          <ExternalButtonLink
            buttonType="ghost"
            href={generateUserPlatformLink(data.profile.userTag)}
            text="View Profile on Noice"
          />
        )}

        <PermissionWrapper>
          <ExternalButtonLink
            buttonType="ghost"
            href={`https://lookerstudio.google.com/u/0/reporting/31d87eed-5203-45e0-80c4-cf3fbbaedc26/page/tEnnC?params={"df4":"include%25EE%2580%25800%25EE%2580%2580EQ%25EE%2580%2580${userId}"}`}
            text="View Profile on Looker Studio"
          />
        </PermissionWrapper>
      </div>
    </section>
  );
}
