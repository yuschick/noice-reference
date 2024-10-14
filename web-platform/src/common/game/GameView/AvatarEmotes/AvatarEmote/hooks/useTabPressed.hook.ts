import { useKeyPress, KeyboardKeys } from '@noice-com/common-ui';
import { useCallback, useState } from 'react';

export function useTabPressed(): boolean {
  const [tabPressed, setTabPressed] = useState<boolean>(false);

  const onTabPressed = useCallback(() => setTabPressed(true), []);

  useKeyPress(KeyboardKeys.Tab, onTabPressed);

  return tabPressed;
}
