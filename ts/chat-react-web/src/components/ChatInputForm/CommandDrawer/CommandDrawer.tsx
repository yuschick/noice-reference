import classNames from 'classnames';

import { ChatDrawer, ChatDrawerProps } from '../../ChatDrawer';

import styles from './CommandDrawer.module.css';

import { EmoteAvatarAnimationFragment } from '@chat-gen';

type CommandDrawerProps = Exclude<ChatDrawerProps, 'onOutsideClick'> & {
  commands: EmoteAvatarAnimationFragment[];
  activeCommand?: EmoteAvatarAnimationFragment['id'];
  onMouseEnter(id: string): void;
  onCommandClick(id: string): void;
};

export function CommandDrawer({
  className,
  commands,
  onCommandClick,
  onMouseEnter,
  activeCommand,
  showDrawer,
}: CommandDrawerProps) {
  return (
    <ChatDrawer
      className={className}
      showDrawer={showDrawer}
    >
      {commands.map(({ id, name, iconUrl, chatCommand }) => (
        <button
          className={classNames(styles.button, { [styles.active]: id === activeCommand })}
          key={id}
          onClick={() => {
            onCommandClick(id);
          }}
          onMouseEnter={() => {
            onMouseEnter(id);
          }}
        >
          <span>
            <span className={styles.title}>{chatCommand}</span>
            <span className={styles.description}>Trigger {name}</span>
          </span>
          <span className={styles.imageContainer}>
            <img
              alt={name}
              className={styles.image}
              src={iconUrl}
            />
          </span>
        </button>
      ))}
    </ChatDrawer>
  );
}
