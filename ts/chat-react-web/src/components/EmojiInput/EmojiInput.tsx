import { useInventoryEmojis } from '@noice-com/chat-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ForwardedRef, forwardRef, KeyboardEvent, useImperativeHandle } from 'react';

import styles from './EmojiInput.module.css';
import { useChatMessageMaxLength } from './hooks/useChatMessageMaxLength.hook';
import { useEditableDiv } from './hooks/useEditableDiv.hook';

import { useChatSettings } from '@chat-common/settings';
import { InventoryEmojiFragment } from '@chat-gen';
import {
  findChildNodeIncludingText,
  getIndexOfNodeText,
  handlePasteHtmlAtCaret,
  selectText,
  generateEmojiImg,
} from '@chat-utils';

export interface EmojiInputRef {
  value: string;
  addEmoji: (emojiLabel: InventoryEmojiFragment['label']) => void;
  replacePartialMatchWithEmoji: (
    partialMatch: string,
    emojiLabel: InventoryEmojiFragment['label'],
  ) => void;
  focus: () => void;
}

export interface EmojiInputProps {
  disabled?: boolean;
  placeholder?: string;
  allowOutsideEnter?: boolean;
  disallowDroppedContent?: boolean;
  onChange(value: string): void;
  onEnter(evt: KeyboardEvent<HTMLDivElement>): void;
}

export const EmojiInput = forwardRef(
  (
    {
      placeholder,
      onChange,
      onEnter,
      allowOutsideEnter,
      disabled,
      disallowDroppedContent,
    }: EmojiInputProps,
    ref: ForwardedRef<EmojiInputRef>,
  ) => {
    const {
      inputRef,
      showPlaceholder,
      messageLength,
      messageRef,
      handleInput,
      handleKeyDown,
      handlePaste,
      updateMessage,
      addText,
    } = useEditableDiv({
      onChange,
      onEnter,
      allowOutsideEnter,
      disallowDroppedContent,
      disabled: !!disabled,
    });
    const inputMaxLength = useChatMessageMaxLength();
    const { fontSize } = useChatSettings();
    const { userId } = useAuthenticatedUser();
    const emojis = useInventoryEmojis({ userId });

    useImperativeHandle(
      ref,
      () => ({
        addEmoji: (emojiLabel: InventoryEmojiFragment['label']) => {
          const emoji = emojis.find((e) => e.label === emojiLabel);

          if (!emoji || !inputRef.current) {
            return;
          }

          // + 2 for the colons
          if (messageLength.current + emoji.label.length + 2 >= inputMaxLength) {
            return;
          }

          /*
          To avoid adding all emojis to the start of the inputRef
          use getSelection, remove breaks and set the cursor to the end
          of the input text range with collapseToEnd.
          */
          inputRef.current?.focus();
          const sel = document.getSelection();
          inputRef.current.innerHTML = inputRef.current.innerHTML.replace('<br>', '');
          sel?.selectAllChildren(inputRef.current);
          sel?.collapseToEnd();

          if (inputRef.current) {
            handlePasteHtmlAtCaret(generateEmojiImg(emoji), inputRef.current);
          }
          inputRef.current?.focus();
          updateMessage();
        },
        replacePartialMatchWithEmoji: (
          partialMatch: string,
          emojiLabel: InventoryEmojiFragment['label'],
        ) => {
          const element = inputRef.current;
          const emoji = emojis.find((e) => e.label === emojiLabel);

          if (!element || !emoji) {
            return;
          }

          if (messageLength.current + emoji.label.length >= inputMaxLength) {
            return;
          }

          const childNode = findChildNodeIncludingText(element, partialMatch);
          const selection = window.getSelection();

          if (!selection || !childNode) {
            return;
          }

          const startIndex = getIndexOfNodeText(childNode, partialMatch);

          selectText(childNode, startIndex, startIndex + partialMatch.length);
          handlePasteHtmlAtCaret(generateEmojiImg(emoji), element);
          updateMessage();
        },
        focus: () => {
          inputRef.current?.focus();
        },
        get value() {
          return messageRef.current;
        },
        set value(msg: string) {
          if (msg === messageRef.current) {
            return;
          }

          if (!inputRef.current) {
            return;
          }

          inputRef.current.innerHTML = '<br>';
          addText(msg);
        },
      }),
      [
        emojis,
        inputRef,
        messageLength,
        inputMaxLength,
        updateMessage,
        messageRef,
        addText,
      ],
    );

    return (
      <div
        aria-label={placeholder}
        className={classNames(styles.emojiInputContainer, {
          [styles.showPlaceholder]: showPlaceholder,
        })}
        contentEditable={!disabled}
        data-placeholder={placeholder}
        data-size={fontSize}
        ref={inputRef}
        role="textbox"
        tabIndex={0}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    );
  },
);
