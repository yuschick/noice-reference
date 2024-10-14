import classNames from 'classnames';
import { useRef, useCallback, TransitionEvent, useEffect } from 'react';

import { AvatarEmote } from '../AvatarEmote';
import { AvatarEmoteDef } from '../types';

import styles from './AvatarEmotesContent.module.css';

interface Props {
  className?: string;
  emojis: AvatarEmoteDef[];
  emotes: AvatarEmoteDef[];
  isShown?: boolean;
  onEmoteButtonClick(item: AvatarEmoteDef): void;
  onTransitionEnd?(): void;
}

export function AvatarEmotesContent({
  className,
  emojis,
  emotes,
  isShown,
  onEmoteButtonClick,
  onTransitionEnd,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onTransitionEndCallback = useCallback(
    (event: TransitionEvent) => {
      if (!onTransitionEnd) {
        return;
      }

      if (event.target !== ref.current) {
        return;
      }

      onTransitionEnd();
    },
    [onTransitionEnd],
  );

  useEffect(() => {
    const wrapper = ref.current;

    if (!wrapper) {
      return;
    }

    if (isShown) {
      wrapper.removeAttribute('inert');
    } else {
      wrapper.setAttribute('inert', 'true');
    }
  }, [isShown]);

  return (
    <div
      className={classNames(styles.wrapper, className)}
      ref={ref}
      onTransitionEnd={onTransitionEndCallback}
    >
      <div className={styles.titleContainer}>
        <span className={styles.title}>All avatar emotes</span>
      </div>

      <div className={styles.scrollableContent}>
        <div className={styles.emotes}>
          {emotes.map((emote) => (
            <AvatarEmote
              emote={emote}
              key={emote.id}
              onClick={onEmoteButtonClick}
            />
          ))}
        </div>

        <div className={styles.emojis}>
          {emojis.map((emote) => (
            <AvatarEmote
              emote={emote}
              key={emote.id}
              onClick={onEmoteButtonClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
