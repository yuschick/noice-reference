import { useInventoryEmojis } from '@noice-com/chat-react-core';
import { useAuthenticatedUser, useKeyPress } from '@noice-com/common-ui';
import { KeyboardKeys } from '@noice-com/utils';
import { useCallback, useState } from 'react';

export interface PartialEmojiMatch {
  text: string;
  matchingEmojis: string[];
}

interface HookResult {
  partialEmojiMatch: PartialEmojiMatch | null;
  onInputChange: () => void;
  clear: () => void;
}

const partialEmojiRegex = /(^|\s):([\w-]+)$/gi;
const MINIMUM_CHARS_FOR_SUGGESTION = 2;

export function usePartialEmojiMatch(): HookResult {
  const { userId } = useAuthenticatedUser();
  const emojis = useInventoryEmojis({ userId });

  const [partialEmojiMatch, setPartialEmojiMatch] = useState<PartialEmojiMatch | null>(
    null,
  );

  const clear = useCallback(() => setPartialEmojiMatch(null), []);

  const onInputChange = useCallback(() => {
    const selection = window.getSelection();

    if (!selection || !selection.focusNode?.nodeValue) {
      clear();
      return;
    }

    const textBeforeCaret = selection.focusNode?.nodeValue.substring(
      0,
      selection.focusOffset,
    );

    const possiblePartialEmojiMatch = textBeforeCaret.match(partialEmojiRegex);

    if (!possiblePartialEmojiMatch) {
      clear();
      return;
    }

    const text = possiblePartialEmojiMatch[0].replace(' ', '');
    const textWithoutColon = text.replace(':', '');

    if (textWithoutColon.length < MINIMUM_CHARS_FOR_SUGGESTION) {
      clear();
      return;
    }

    const matchingEmojis = emojis
      .filter(({ label }) => {
        const matchRegExp = new RegExp(`(${textWithoutColon})`, 'gi');

        return matchRegExp.test(label);
      })
      .map(({ label }) => label);

    if (matchingEmojis.length === 0) {
      clear();
      return;
    }

    setPartialEmojiMatch({ text, matchingEmojis });
  }, [clear, emojis]);

  useKeyPress(KeyboardKeys.ArrowLeft, clear);
  useKeyPress(KeyboardKeys.ArrowRight, clear);
  useKeyPress(KeyboardKeys.Escape, clear);

  return {
    partialEmojiMatch,
    onInputChange,
    clear,
  };
}
