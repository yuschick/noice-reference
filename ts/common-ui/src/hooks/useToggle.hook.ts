import { useCallback, useState } from 'react';

type HookResult = [
  isOpen: boolean,
  onToggle: () => void,
  onOpen: () => void,
  onClose: () => void,
];

export function useToggle(initialState: boolean): HookResult {
  const [isOpen, setOpen] = useState(initialState);

  const onToggle = useCallback(() => setOpen((cur) => !cur), []);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  return [isOpen, onToggle, onOpen, onClose];
}
