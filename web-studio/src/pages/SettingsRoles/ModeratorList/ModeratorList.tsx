import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { ProfileImage, IconButton, InputField } from '@noice-com/common-ui';
import { useState } from 'react';

import styles from './ModeratorList.module.css';

import { PermissionWrapper } from '@common/permission';
import { ModeratorProfileFragment } from '@gen';

interface Props {
  moderators: ModeratorProfileFragment[];
  onRemoveModerator(userId: string): void;
}

const mapFilterByPlayerName = (
  keyword?: string,
): ((profile: ModeratorProfileFragment) => boolean) => {
  if (!keyword) {
    return () => true;
  }

  const key = keyword.toLowerCase();

  return ({ userTag }) => userTag.toLowerCase().indexOf(key) >= 0;
};

export function ModeratorList({ moderators, onRemoveModerator }: Props) {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      <div className={styles.search}>
        <InputField
          description="Find by username"
          isDisabled={!moderators.length}
          label="Search moderator"
          theme="gray"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {moderators.length ? (
        <ul className={styles.moderatorList}>
          {moderators.filter(mapFilterByPlayerName(keyword)).map((profile, index) => (
            <li
              className={styles.moderatorItem}
              key={index}
            >
              <div className={styles.moderatorWrapper}>
                <div className={styles.avatarWrapper}>
                  <ProfileImage
                    profile={profile}
                    size="md"
                  />
                </div>
                <div className={styles.name}>{profile.userTag}</div>
              </div>

              <PermissionWrapper>
                <IconButton
                  icon={CoreAssets.Icons.Trash}
                  label={`Remove ${profile.userTag} from moderators`}
                  level="secondary"
                  size="sm"
                  onClick={() => onRemoveModerator(profile.userId)}
                />
              </PermissionWrapper>
            </li>
          ))}
        </ul>
      ) : (
        <span>No moderators</span>
      )}
    </div>
  );
}

ModeratorList.fragments = {
  entry: gql`
    fragment ModeratorProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageProfile
    }
  `,
};
