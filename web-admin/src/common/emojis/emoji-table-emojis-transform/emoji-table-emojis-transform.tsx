import { gql } from '@apollo/client';
import { Image } from '@noice-com/common-ui';

import styles from './emoji-table-emojis-transform.module.css';

import { TableData } from '@common/table';
import { Pill } from '@common/text';
import { EmojiTableEmojiFragment } from '@gen';

gql`
  fragment EmojiTableEmoji on EmojiEmoji {
    id
    image
    label
    disabled
  }
`;

export const emojiTableEmojisTransform = (emojis: EmojiTableEmojiFragment[]): TableData =>
  emojis.map((emoji) =>
    (({ id, image, label, disabled }) => ({
      state: (
        <Pill
          text={disabled ? 'Disabled' : 'Enabled'}
          type={disabled ? 'default' : 'positive'}
        />
      ),
      emoji: (
        <Image
          alt={label}
          className={disabled ? styles.tableDisabledImage : undefined}
          height={32}
          src={image}
          width={32}
        />
      ),
      id,
      code: (
        <span className={disabled ? styles.tableDisabledText : undefined}>
          {label.replace(/:/g, '')}
        </span>
      ),
    }))(emoji),
  ) || [];
