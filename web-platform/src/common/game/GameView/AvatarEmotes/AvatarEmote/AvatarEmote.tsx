import { Image, LoadingSkeleton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';

import { AvatarEmoteDef } from '../types';

import styles from './AvatarEmote.module.css';
import { useTabPressed, useEmojiKeybindings } from './hooks';

import FileMissing from '@assets/images/file-missing.webp';

interface Props {
  emote: AvatarEmoteDef;
  onClick(item: AvatarEmoteDef): void;
}

export function AvatarEmote({ emote, onClick }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);

  const onClickWrapper = useCallback(() => onClick(emote), [onClick, emote]);

  const tabUsed = useTabPressed();
  const keyPressed = useEmojiKeybindings({
    item: emote,
    onClick: onClickWrapper,
  });

  return (
    <button
      className={classNames(styles.button, {
        [styles.emoteButton]: emote.type === 'emote',
        [styles.emojiButton]: emote.type === 'emoji',
        [styles.preventOutline]: !tabUsed,
        [styles.active]: keyPressed,
      })}
      title={emote.name}
      onClick={onClickWrapper}
    >
      {!!emote.keyBinding && <kbd className={styles.keybind}>{emote.keyBinding}</kbd>}
      <Image
        alt={emote.name}
        className={styles.image}
        fallbackSrc={FileMissing}
        height={24}
        ref={imageRef}
        sizes="1.5rem"
        src={emote.icon}
        width={24}
      />
    </button>
  );
}

AvatarEmote.Loading = () => <LoadingSkeleton className={styles.button} />;
