import { useEffect, useState } from 'react';

import { useCardGameGroup } from './useCardGameGroup.hook';

// @todo: We have to check how this works when it comes to changing groups.
// useCardGameGroup should handle all of the complex logic, but we need to check.
export function usePlayingSolo(): boolean {
  const group = useCardGameGroup();
  const [isSolo, setIsSolo] = useState(group?.isSolo ?? false);

  useEffect(() => {
    setIsSolo(group?.isSolo ?? false);
  }, [group]);

  return isSolo;
}
