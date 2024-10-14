import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
import { Nullable } from '@noice-com/utils';

export interface ChestProps {
  className?: string;
  rarity: Nullable<Rarity>;
}

export function Chest({ rarity, className }: ChestProps) {
  if (rarity === Rarity.RARITY_EPIC) {
    return (
      <Icon
        className={className}
        icon={CoreAssets.Icons.EpicAdChest}
      />
    );
  }

  if (rarity === Rarity.RARITY_LEGENDARY) {
    return (
      <Icon
        className={className}
        icon={CoreAssets.Icons.LegendaryAdChest}
      />
    );
  }

  if (rarity === Rarity.RARITY_RARE) {
    return (
      <Icon
        className={className}
        icon={CoreAssets.Icons.RareAdChest}
      />
    );
  }

  if (rarity === Rarity.RARITY_UNCOMMON) {
    return (
      <Icon
        className={className}
        icon={CoreAssets.Icons.UncommonAdChest}
      />
    );
  }

  return (
    <Icon
      className={className}
      icon={CoreAssets.Icons.CommonAdChest}
    />
  );
}
