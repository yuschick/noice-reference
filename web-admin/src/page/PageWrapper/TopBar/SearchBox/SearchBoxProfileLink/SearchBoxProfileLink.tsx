import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { generatePath } from 'react-router';

import styles from './SearchBoxProfileLink.module.css';

import { PermissionLink } from '@common/permission';
import { getUserMatchedField } from '@common/search';
import { HighlightedText } from '@common/text';
import { SearchBoxProfileLinkProfileFragment } from '@gen';

interface Props {
  profile: SearchBoxProfileLinkProfileFragment;
  matchedProperties: string[];
  query: string;
  className?: string;
}

export function SearchBoxProfileLink({
  profile,
  className,
  matchedProperties,
  query,
}: Props) {
  const { userId, userTag } = profile;

  const matchField = getUserMatchedField(profile, matchedProperties);

  return (
    <PermissionLink
      className={className}
      to={generatePath('/users/:userId', { userId: userId })}
    >
      <ProfileImage
        profile={profile}
        size="xs"
      />

      <div className={styles.userDetails}>
        <HighlightedText
          query={query}
          text={userTag}
        />

        {matchField && matchField.field !== 'userTag' && (
          <div className={styles.matchRow}>
            <HighlightedText
              query={query}
              text={matchField.value}
            />
            <span>{matchField.field}</span>
          </div>
        )}
      </div>
    </PermissionLink>
  );
}

SearchBoxProfileLink.fragments = {
  entry: gql`
    fragment SearchBoxProfileLinkProfile on ProfileProfile {
      userId
      userTag
      ...SearchMatchResultProfile
      ...ProfileImageProfile
    }
  `,
};
