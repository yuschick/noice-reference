import { ReactNode } from 'react';

import { ChatEmoji } from '../../ChatEmoji';

import styles from './EmojiCategory.module.css';

import { InventoryEmojiFragment } from '@chat-gen';

interface Props {
  title: ReactNode;
  emojis: InventoryEmojiFragment[];
  onEmojiClicked(emoji: string): void;
}

export function EmojiCategory({ title, emojis, onEmojiClicked }: Props) {
  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryTitle}>{title}</div>
      <div className={styles.emojiContainer}>
        {emojis.map(({ label, id, image }) => (
          <button
            aria-label={`:${label}:`}
            className={styles.emojiButton}
            key={id}
            type="button"
            onClick={() => onEmojiClicked(label)}
          >
            <ChatEmoji
              emoji={`:${label}:`}
              source={image}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
