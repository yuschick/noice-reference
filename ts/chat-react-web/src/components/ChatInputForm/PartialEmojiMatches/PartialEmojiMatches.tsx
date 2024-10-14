import { useInventoryEmojis } from '@noice-com/chat-react-core';
import {
  useCircularArrayNavigation,
  useKeyPress,
  KeyboardKeys,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatDrawer } from '../../ChatDrawer';
import { ChatEmoji } from '../../ChatEmoji';

import styles from './PartialEmojiMatches.module.css';
import { PartialMatch } from './PartialMatch';

import { InventoryEmojiFragment } from '@chat-gen';

export interface Props {
  className?: string;
  showDrawer: boolean;
  emojiMatches: string[];
  partialText: string;
  onSelectEmoji: (emojiLabel: InventoryEmojiFragment['label']) => void;
  onOutsideClick: () => void;
}

export function PartialEmojiMatches({
  className,
  emojiMatches,
  showDrawer,
  partialText,
  onSelectEmoji,
  onOutsideClick,
}: Props) {
  const { userId } = useAuthenticatedUser();
  const emojis = useInventoryEmojis({ userId });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [prevIndex, nextIndex] = useCircularArrayNavigation(emojiMatches, selectedIndex);

  const partialEmojis = useRef<HTMLButtonElement[]>([]);

  const onArrowUp = useCallback(
    (ev: KeyboardEvent) => {
      if (emojiMatches.length === 0) {
        return;
      }

      ev.preventDefault();
      setSelectedIndex(prevIndex);

      // Scroll to the selected emoji
      if (partialEmojis.current[prevIndex]) {
        partialEmojis.current[prevIndex].scrollIntoView();
      }
    },
    [prevIndex, emojiMatches],
  );

  const onArrowDown = useCallback(
    (ev: KeyboardEvent) => {
      if (emojiMatches.length === 0) {
        return;
      }

      ev.preventDefault();
      setSelectedIndex(nextIndex);

      // Scroll to the selected emoji
      if (partialEmojis.current[nextIndex]) {
        partialEmojis.current[nextIndex].scrollIntoView();
      }
    },
    [nextIndex, emojiMatches],
  );
  const onEnter = useCallback(
    (ev: KeyboardEvent) => {
      if (emojiMatches.length === 0) {
        return;
      }

      ev.preventDefault();
      const selectedEmoji = emojiMatches[selectedIndex];
      onSelectEmoji(selectedEmoji);
    },
    [emojiMatches, selectedIndex, onSelectEmoji],
  );

  useKeyPress(KeyboardKeys.ArrowUp, onArrowUp);
  useKeyPress(KeyboardKeys.ArrowDown, onArrowDown);
  useKeyPress(KeyboardKeys.Enter, onEnter);
  useKeyPress(KeyboardKeys.Tab, onEnter);

  const onMouseEnter = useCallback((index: number) => setSelectedIndex(index), []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [emojiMatches]);

  return (
    <ChatDrawer
      className={className}
      showDrawer={showDrawer}
      onOutsideClick={onOutsideClick}
    >
      {emojiMatches.map((emojiLabel, index) => {
        const emoji = emojis.find((e) => e.label === emojiLabel);

        if (!emoji) {
          return null;
        }

        const { label, id, image } = emoji;

        return (
          <button
            className={classNames(styles.row, {
              [styles.selected]: index === selectedIndex,
            })}
            key={id}
            ref={(element) => {
              if (element) {
                partialEmojis.current[index] = element;
              }
            }}
            onClick={() => onSelectEmoji(label)}
            onMouseEnter={() => onMouseEnter(index)}
          >
            <ChatEmoji
              emoji={`:${label}:`}
              source={image}
              disableTooltip
            />
            <span className={styles.label}>
              <PartialMatch
                partialMatch={partialText}
                text={`:${label}:`}
              />
            </span>
          </button>
        );
      })}
    </ChatDrawer>
  );
}
