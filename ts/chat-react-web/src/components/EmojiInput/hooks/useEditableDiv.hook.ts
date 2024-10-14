import { parseEmojisFromMessage, useInventoryEmojis } from '@noice-com/chat-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { TextMessageAttachment } from '@noice-com/schemas/chat/chat.pb';
import {
  ClipboardEvent,
  KeyboardEvent,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useChatMessageMaxLength } from './useChatMessageMaxLength.hook';

import { InventoryEmojiFragment } from '@chat-gen';
import {
  findChildNodeIncludingText,
  getIndexOfNodeText,
  handlePasteHtmlAtCaret,
  selectText,
  generateEmojiImg,
} from '@chat-utils';

interface Props {
  onChange: (message: string) => void;
  onEnter: (evt: KeyboardEvent<HTMLDivElement>) => void;
  allowOutsideEnter?: boolean;
  disallowDroppedContent?: boolean;
  disabled: boolean;
}

interface HookResult {
  handleInput: () => void;
  handlePaste: (event: ClipboardEvent<HTMLDivElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  updateMessage: () => void;
  addText: (text: string) => void;
  showPlaceholder: boolean;
  inputRef: RefObject<HTMLDivElement>;
  messageLength: MutableRefObject<number>;
  messageRef: MutableRefObject<string>;
}

const emojiRegex = /:([\w-]+):/gi;

// keys that are allow even when editing is forbidden (too long message etc.)
const alwaysAllowedKeys = [
  'ArrowUp',
  'ArrowDown',
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
];

const transformTextAttachmentToInventoryEmoji = (
  attachment: Required<TextMessageAttachment>,
): InventoryEmojiFragment => ({
  label: attachment.label.replace(/:/g, ''),
  image: attachment.source,
  id: attachment.itemId,
  channelId: '',
});

export function useEditableDiv({
  onChange,
  onEnter,
  allowOutsideEnter,
  disallowDroppedContent,
  disabled,
}: Props): HookResult {
  const messageRef = useRef<string>('');
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const messageLength = useRef<number>(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const inputMaxLength = useChatMessageMaxLength();

  const { userId } = useAuthenticatedUser();
  const emojis = useInventoryEmojis({ userId });

  const updateMessage = useCallback(() => {
    const element = inputRef.current;

    if (!element) {
      return;
    }

    const cloneElement = element.cloneNode(true) as HTMLDivElement;

    const images = Array.from(cloneElement.querySelectorAll('img'));

    const updatedMessageLength = cloneElement.innerText.replace(/\n$/, '').length;
    let imagesLength = 0;

    images.forEach((image) => {
      image.outerHTML = image.alt;
      imagesLength += image.alt.length;
    });

    const message = cloneElement.innerText.replace(/\n$/, '');

    messageRef.current = message;
    setShowPlaceholder(!message.length);
    messageLength.current = updatedMessageLength + imagesLength;
    onChange(message);
  }, [onChange]);

  const addText = useCallback(
    (text: string, textMaxLength = inputMaxLength) => {
      let messageEmojis = parseEmojisFromMessage(text, emojis);

      const emojiLabelsLength = messageEmojis.reduce<number>((prev, curr) => {
        return (prev += curr.label.length);
      }, 0);

      const textLength = text.length - emojiLabelsLength + messageEmojis.length;

      if (textLength > textMaxLength) {
        // Handle emojis
        if (messageEmojis.length) {
          let point = 0;
          text = messageEmojis.reduce<string>((prev, curr) => {
            // Nothing fits in
            if (point >= textMaxLength) {
              return prev;
            }

            // Only (some) text before emoji fits in
            if (curr.startIndex >= textMaxLength) {
              prev += text.slice(point, textMaxLength);
              point = textMaxLength;
              return prev;
            }

            // Emoji and text before fits in
            prev += text.slice(point, curr.endIndex + 1);
            point = curr.endIndex + 1;
            // correct max length
            textMaxLength += curr.label.length - 1;

            return prev;
          }, '');

          // Fetch emojis again as there might be less
          messageEmojis = parseEmojisFromMessage(text, emojis);
        }
        // Just slice if no emojis
        else {
          text = text.slice(0, textMaxLength);
        }
      }

      let startingPoint = 0;
      const textWithEmojis = messageEmojis.map((emoji) => {
        const textPortion = `${text.substring(
          startingPoint,
          emoji.startIndex,
        )}${generateEmojiImg(transformTextAttachmentToInventoryEmoji(emoji))}`;

        // Set the starting point to the end index and go again
        startingPoint = emoji.endIndex + 1;

        return textPortion;
      });

      if (startingPoint < text.length) {
        textWithEmojis.push(text.substring(startingPoint));
      }

      text = textWithEmojis.join('');

      if (inputRef.current) {
        handlePasteHtmlAtCaret(text, inputRef.current);
      }
      updateMessage();
    },
    [inputMaxLength, emojis, updateMessage],
  );

  const handleInput = useCallback(() => {
    const element = inputRef.current;

    if (!element) {
      return;
    }

    const emojiMatches = [...element.innerText.matchAll(emojiRegex)];

    // There is no emoji syntax used
    if (!emojiMatches.length) {
      updateMessage();
      return;
    }

    emojiMatches.forEach((emojiMatch) => {
      // There is no emoji syntax used
      if (!emojiMatch[1]) {
        updateMessage();
        return;
      }

      const emoji = emojis.find((e) => e.label === emojiMatch[1].toLowerCase());

      // No emoji with that syntax
      if (!emoji) {
        updateMessage();
        return;
      }

      const childNode = findChildNodeIncludingText(element, emojiMatch[0]);
      const selection = window.getSelection();

      if (!selection || !childNode) {
        updateMessage();
        return;
      }

      const startIndex = getIndexOfNodeText(childNode, emojiMatch[0]);

      // select emoji text (add 2 for colons)
      selectText(childNode, startIndex, startIndex + emoji.label.length + 2);

      // replace with img
      if (inputRef.current) {
        handlePasteHtmlAtCaret(generateEmojiImg(emoji), inputRef.current);
      }
    });

    updateMessage();
  }, [updateMessage, emojis]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' && !allowOutsideEnter) {
        event.preventDefault();

        // Run given function
        onEnter(event);
        return;
      }

      // always allow meta and ctrl keys
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      if (alwaysAllowedKeys.includes(event.key)) {
        return;
      }

      if (messageLength.current >= inputMaxLength) {
        event.preventDefault();
      }
    },
    [allowOutsideEnter, inputMaxLength, onEnter],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (disabled) {
        return;
      }

      const clipboardData = event.clipboardData;
      const pastedData = clipboardData.getData('Text');

      addText(pastedData, inputMaxLength - messageLength.current);
    },
    [addText, disabled, inputMaxLength],
  );

  useEffect(() => {
    const element = inputRef.current;

    if (!element || !disallowDroppedContent) {
      return;
    }

    element.addEventListener('drop', (e: DragEvent) => e.preventDefault());
    return element.removeEventListener('drop', (e: DragEvent) => e.preventDefault());
  }, [disallowDroppedContent]);

  useEffect(() => {
    const element = inputRef.current;

    if (!element) {
      return;
    }

    element.innerHTML = '<br>';
  }, []);

  return {
    showPlaceholder,
    inputRef,
    messageLength,
    messageRef,
    handleInput,
    handlePaste,
    handleKeyDown,
    updateMessage,
    addText,
  };
}
