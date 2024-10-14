import { useToggle, IconButton, useOnOutsideClick } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { AvatarEmote } from './AvatarEmote';
import styles from './AvatarEmotes.module.css';
import { AvatarEmotesContent } from './AvatarEmotesContent';
import { AvatarEmoteDef, RecentlyUsedEmote } from './types';

export interface Props {
  className?: string;
  recentlyUsed: RecentlyUsedEmote[];
  emotes: AvatarEmoteDef[];
  emojis: AvatarEmoteDef[];
  loading?: boolean;
  onEmoteButtonClick(item: AvatarEmoteDef): void;
}

export function AvatarEmotes({
  emojis,
  emotes,
  recentlyUsed,
  className,
  loading,
  onEmoteButtonClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, toggleExpand, _, close] = useToggle(false);
  const drawerId = 'emote-drawer';

  const onContentTransitionEnd = useCallback(() => {
    // Dispatch resize so tooltips goes to right place
    window.dispatchEvent(new Event('resize'));
  }, []);

  useOnOutsideClick(ref, close, { exempt: ['portals'] });

  return (
    <div
      className={classNames(styles.wrapper, { [styles.hidden]: !expanded }, className)}
      id={drawerId}
      ref={ref}
    >
      <div className={styles.alwaysVisibleContent}>
        <div className={styles.recentlyUsed}>
          {loading
            ? Array(4)
                .fill(undefined)
                .map((_, index) => <AvatarEmote.Loading key={index} />)
            : recentlyUsed.map((item) => (
                <AvatarEmote
                  emote={item}
                  key={item.id}
                  onClick={onEmoteButtonClick}
                />
              ))}
        </div>

        {loading ? (
          <AvatarEmote.Loading />
        ) : (
          <IconButton
            aria-controls={drawerId}
            aria-expanded={expanded}
            icon={expanded ? FaChevronDown : FaChevronUp}
            label={`${expanded ? 'Close' : 'Open'} emote drawer`}
            level="secondary"
            size="sm"
            onClick={toggleExpand}
          />
        )}
      </div>

      <AvatarEmotesContent
        className={styles.content}
        emojis={emojis}
        emotes={emotes}
        isShown={expanded}
        onEmoteButtonClick={onEmoteButtonClick}
        onTransitionEnd={onContentTransitionEnd}
      />
    </div>
  );
}
