import { gql } from '@apollo/client';
import { Image, Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import styles from './Grid.module.css';
import { GridItem } from './GridItem/GridItem';

import { AvatarSelectorGridAvatarFragment } from '@gen';

gql`
  fragment AvatarSelectorGridAvatar on AvatarAvatar {
    id
    body
  }
`;

interface Props {
  avatars: AvatarSelectorGridAvatarFragment[];
  selectedAvatarId: Nullable<string>;
  onSelectAvatar(avatarId: string): void;
}

export function Grid({ avatars, selectedAvatarId, onSelectAvatar }: Props) {
  return (
    <div className={styles.gridContent}>
      <div className={styles.grid}>
        <div className={styles.gridItems}>
          {avatars.map((avatar, index) => {
            return (
              <GridItem
                key={`item_${index}`}
                selected={selectedAvatarId === avatar.id}
                onClick={() => onSelectAvatar(avatar.id)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.avatarBodyImage}
                    loadingType="none"
                    src={avatar.body}
                  />
                </div>
                {selectedAvatarId === avatar.id && (
                  <Icon
                    className={styles.checkIcon}
                    icon={IoIosCheckmarkCircle}
                  />
                )}
              </GridItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}
