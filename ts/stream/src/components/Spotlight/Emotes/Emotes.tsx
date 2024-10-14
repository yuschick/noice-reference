import { Image } from '@noice-com/common-ui';

import styles from './Emotes.module.css';

import { AvatarEmoteDef } from '@stream-types';

interface Props {
  emotes: AvatarEmoteDef[];
  onEmoteButtonClick(emote: AvatarEmoteDef): void;
}

export function Emotes({ emotes, onEmoteButtonClick }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.text}>Show off your emotes!</span>
      {emotes.map((emote) => (
        <button
          className={styles.button}
          key={emote.id}
          onClick={() => onEmoteButtonClick(emote)}
        >
          <Image
            alt={emote.name}
            className={styles.image}
            height={40}
            sizes="40px"
            src={emote.icon}
            width={40}
          />
        </button>
      ))}
    </div>
  );
}
