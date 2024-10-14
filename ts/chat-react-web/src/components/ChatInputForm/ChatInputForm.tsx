import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';

import { EmojiDrawer } from '../EmojiDrawer';
import { EmojiInput, EmojiInputRef } from '../EmojiInput';

import styles from './ChatInputForm.module.css';
import { ChatSettings } from './ChatSettings/ChatSettings';
import { CommandDrawer } from './CommandDrawer';
import { useAvatarMovements } from './hooks';
import { PartialEmojiMatches } from './PartialEmojiMatches';

import { EmoteAvatarAnimationFragment, InventoryEmojiFragment } from '@chat-gen';
import { usePartialEmojiMatch } from '@chat-hooks';

const commandRegex = /^\/[\w-]*$/;

export interface ChatInputFormProps {
  disabled?: boolean;
  sendMessage: (msg: string) => void;
  placeholder?: string;
  replyTo?: string;
  onReplyCancel: () => void;
  // TODO: decouple CommandDrawer and ChatInputForm, figure out if sendTriggerEmote prop still needed in decoupled component
  sendTriggerEmote?: (emoteId: string) => void;
}

export function ChatInputForm({
  disabled,
  sendMessage,
  placeholder,
  replyTo,
  onReplyCancel,
  sendTriggerEmote,
}: ChatInputFormProps) {
  const [showEmojiDrawer, setShowEmojiDrawer] = useState(false);
  const [commands, setCommands] = useState<EmoteAvatarAnimationFragment[]>([]);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const emojiInputRef = useRef<EmojiInputRef>(null);
  const { movements } = useAvatarMovements();

  // Input does not take care of ArrowUp nor ArrowDown
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!commands.length) {
        return;
      }

      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();

        // If active index is already at bottom, do nothing
        if (activeCommandIndex === commands.length - 1) {
          return;
        }

        setActiveCommandIndex(activeCommandIndex + 1);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();

        // If active index is already at top, do nothing
        if (activeCommandIndex === 0) {
          return;
        }

        setActiveCommandIndex(activeCommandIndex - 1);
        return;
      }
    },
    [activeCommandIndex, commands.length],
  );

  // Focus when reply added
  useEffect(() => {
    if (!replyTo) {
      return;
    }

    emojiInputRef.current?.focus();
  }, [replyTo, emojiInputRef]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [commands, activeCommandIndex, onKeyDown]);

  // Every time commands change, set active index back to top
  useEffect(() => {
    setActiveCommandIndex(0);
  }, [commands]);

  const onSendClicked = useCallback(() => {
    if (!emojiInputRef.current) {
      return;
    }

    const message = emojiInputRef.current.value;

    if (message !== '') {
      sendMessage(replyTo ? `@${replyTo} ${message}` : message);
      setShowEmojiDrawer(false);
      onReplyCancel();
      emojiInputRef.current.value = '';
    }

    emojiInputRef.current.focus();
  }, [sendMessage, onReplyCancel, replyTo]);

  const onEmojiClicked = useCallback((emojiLabel: InventoryEmojiFragment['label']) => {
    if (!emojiInputRef.current) {
      return;
    }

    emojiInputRef.current.addEmoji(emojiLabel);
  }, []);

  const onCommandClick = useCallback(
    (command: string) => {
      if (!emojiInputRef.current) {
        return;
      }

      emojiInputRef.current.value = '';

      if (sendTriggerEmote) {
        sendTriggerEmote(command);
      }
    },
    [sendTriggerEmote],
  );

  const handleEnter = useCallback(() => {
    // If there is commands, run active one
    if (commands.length && commands[activeCommandIndex]) {
      onCommandClick(commands[activeCommandIndex].id);
      return;
    }

    // Otherwise send message
    onSendClicked();
  }, [activeCommandIndex, commands, onCommandClick, onSendClicked]);

  const onEmojiDrawerButton = useCallback(() => {
    setShowEmojiDrawer((currentShowEmojiDrawer) => !currentShowEmojiDrawer);
  }, []);

  const SendIcon = CoreAssets.Icons.Send;

  const { partialEmojiMatch, onInputChange, clear } = usePartialEmojiMatch();

  const onSelectEmojiForPartialMatch = useCallback(
    (emojiLabel: InventoryEmojiFragment['label']) => {
      if (!partialEmojiMatch) {
        return;
      }

      emojiInputRef.current?.replacePartialMatchWithEmoji(
        partialEmojiMatch.text,
        emojiLabel,
      );
      clear();
    },
    [partialEmojiMatch, clear],
  );

  const onChange = useCallback(
    (text: string) => {
      const commandMatches = text.match(commandRegex);

      if (commandMatches?.[0] && movements.length) {
        setCommands(
          movements.filter(({ chatCommand }) =>
            chatCommand.startsWith(commandMatches[0]),
          ),
        );
      } else {
        setCommands([]);
      }

      onInputChange();
    },
    [movements, onInputChange],
  );

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.showEmojiDrawer]: showEmojiDrawer,
      })}
    >
      <PartialEmojiMatches
        className={styles.partialEmojiMatches}
        emojiMatches={partialEmojiMatch?.matchingEmojis ?? []}
        partialText={partialEmojiMatch?.text ?? ''}
        showDrawer={!!partialEmojiMatch}
        onOutsideClick={clear}
        onSelectEmoji={onSelectEmojiForPartialMatch}
      />
      <EmojiDrawer
        className={styles.emojiDrawer}
        showDrawer={showEmojiDrawer}
        onEmojiClicked={onEmojiClicked}
        onOutsideClick={() => {
          setShowEmojiDrawer(false);
        }}
      />

      <CommandDrawer
        activeCommand={commands[activeCommandIndex]?.id}
        className={styles.commandDrawer}
        commands={commands}
        showDrawer={!!commands.length}
        onCommandClick={onCommandClick}
        onMouseEnter={(id: string) => {
          setActiveCommandIndex(commands.findIndex((command) => command.id === id));
        }}
      />

      {!!replyTo && (
        <div className={styles.replyToContainer}>
          <span className={styles.replyLabel}>{`replying to @${replyTo}`}</span>

          <IconButton
            icon={MdClose}
            label="close"
            size="sm"
            variant="ghost"
            onClick={onReplyCancel}
          />
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <EmojiInput
            allowOutsideEnter={!!partialEmojiMatch}
            disabled={disabled}
            placeholder={placeholder}
            ref={emojiInputRef}
            disallowDroppedContent
            onChange={onChange}
            onEnter={handleEnter}
          />

          <div className={styles.emojiDrawerButtonContainer}>
            <IconButton
              icon={HiOutlineEmojiHappy}
              isDisabled={disabled}
              label="Toggle emoji drawer"
              size="sm"
              variant="ghost"
              onClick={onEmojiDrawerButton}
            />
          </div>
        </div>

        <ChatSettings className={styles.settings} />

        <div className={styles.sendButton}>
          <IconButton
            icon={SendIcon}
            isDisabled={disabled}
            label="Send chat message"
            size="sm"
            onClick={onSendClicked}
          />
        </div>
      </div>
    </div>
  );
}
