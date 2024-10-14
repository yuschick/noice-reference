import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { CommonUtils, IconButton, ProfileImage } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMiniProfileContext } from '../../context';

import styles from './MiniProfileHeader.module.css';
import { MiniProfileModerationState } from './MiniProfileModerationState';

import { useSocialPackageInternal } from '@social-context';
import { MiniProfileHeaderProfileFragment } from '@social-gen';

gql`
  fragment MiniProfileHeaderProfile on ProfileProfile {
    userTag
    temporary
    isNewUsername
    ...ProfileImageProfile
  }
`;

interface Props {
  profile: MiniProfileHeaderProfileFragment;
}

export function MiniProfileHeader({ profile }: Props) {
  const { userTag, temporary, isNewUsername } = profile;

  const { onClose } = useMiniProfileContext();
  const { createProfileRoutePath } = useSocialPackageInternal();
  const userTagLinkRef = useRef<HTMLAnchorElement>(null);
  const [triggerElement] = useState<HTMLElement | null>(
    document.activeElement as HTMLElement | null,
  );

  useMountEffect(() => {
    if (userTagLinkRef.current) {
      userTagLinkRef.current.focus();
    }

    // return focus to the trigger element for smooth keyboard navigation
    return () => triggerElement?.focus();
  });

  const isEmbed = CommonUtils.isReactNativeWebView();

  return (
    <div className={styles.miniProfileHeader}>
      <ProfileImage profile={profile} />

      <div className={styles.miniProfileHeaderContent}>
        {temporary || isEmbed ? (
          <span className={styles.miniProfileName}>{userTag}</span>
        ) : (
          <Link
            className={classNames(styles.miniProfileName, styles.miniProfileNameLink)}
            ref={userTagLinkRef}
            to={createProfileRoutePath(userTag)}
            onClick={onClose}
          >
            {userTag}
          </Link>
        )}

        {isNewUsername && (
          <span className={styles.newUsernameIndicator}>Username changed recently</span>
        )}

        <MiniProfileModerationState />
      </div>

      <IconButton
        icon={CoreAssets.Icons.Close}
        label="Close"
        size="sm"
        variant="ghost"
        onClick={onClose}
      />
    </div>
  );
}
