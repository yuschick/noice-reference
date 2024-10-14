import { CoreAssets } from '@noice-com/assets-core';
import { Button } from '@noice-com/common-ui';

import styles from './LoadMoreChannels.module.css';

import { usePlaySound, AppSoundKeys } from '@common/sound';

interface Props {
  onClick: () => void;
}

export function ShowMoreButton({ onClick }: Props) {
  const [playLoadMoreChannelsHoverSound] = usePlaySound(AppSoundKeys.ButtonClickConfirm);

  const onMouseEnter = () => {
    playLoadMoreChannelsHoverSound();
  };

  return (
    <div className={styles.showMoreWrapper}>
      <Button
        iconEnd={CoreAssets.Icons.ChevronDown}
        level="secondary"
        size="sm"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        Show more
      </Button>
    </div>
  );
}
