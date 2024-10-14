import { useCallback, useEffect, useState } from 'react';

interface WithKeybinding {
  keyBinding?: string;
}

interface Props<E extends WithKeybinding> {
  item: E;
  onClick(item: E): void;
}

export function useEmojiKeybindings<E extends WithKeybinding>({
  item,
  onClick,
}: Props<E>): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // Ignore user typing on content editable field
      if (target.isContentEditable) {
        return;
      }

      // Ignore event if typing in a text field
      if (target.tagName.toLowerCase() === 'input') {
        return;
      }

      if (item.keyBinding !== event.key) {
        return;
      }

      setKeyPressed(false);
    },
    [item],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      // Ignore user typing on content editable field
      if (target.isContentEditable) {
        return;
      }

      // Ignore event if typing in a text field
      if (target.tagName.toLowerCase() === 'input') {
        return;
      }

      if (item.keyBinding !== event.key) {
        return;
      }

      onClick(item);
      setKeyPressed(true);
    },
    [item, onClick],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return keyPressed;
}
