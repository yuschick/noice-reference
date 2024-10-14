import styles from './AutoModQueue.module.css';
import { useChatModerationItems } from './hooks/useAutoModQueueEvents.hook';
import { ModerationItem } from './ModerationItem/ModerationItem';

import { AutoScrollWrapper } from '@common/scroll';

interface Props {
  chatId: string;
}

export function AutoModQueue({ chatId }: Props) {
  const { items, deleteItem } = useChatModerationItems(chatId);
  const lastItem = items.length > 0 ? items[items.length - 1] : null;

  return (
    <div className={styles.automodContainer}>
      <AutoScrollWrapper
        ariaLabel="AutoModeration window"
        itemName="item"
        itemsAmount={items.length}
        triggerValue={lastItem}
      >
        {items.map((item) => (
          <ModerationItem
            chatId={chatId}
            key={item.id}
            onClear={deleteItem}
            {...item}
          />
        ))}
      </AutoScrollWrapper>
    </div>
  );
}
