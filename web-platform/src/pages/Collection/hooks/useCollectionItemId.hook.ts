import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

interface HookResult {
  itemId: Nullable<string>;
  actions: {
    setItemId(itemId: Nullable<string>): void;
  };
}

export function useCollectionItemId(): HookResult {
  const [itemId, setItemId] = useState<Nullable<string>>(null);

  return {
    itemId,
    actions: {
      setItemId,
    },
  };
}
