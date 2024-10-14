import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import { AvatarComposition, ExtendedAvatarPart } from '../../types';
import { CategoryTitle } from '../CategoryTitle/CategoryTitle';
import { getCompositionGender } from '../utils';

import styles from './ClothingSets.module.css';
import { useClothingSets } from './hooks/useClothingSets.hook';
import { SetGridItem } from './SetGridItem/SetGridItem';

import { WalletWalletCurrency } from '@gen';

interface Props {
  avatarParts: Nullable<ExtendedAvatarPart[]>;
  currency?: WalletWalletCurrency;
  avatarComposition: Nullable<AvatarComposition>;
  onSelect(setName: string, parts: AvatarPart[]): void;
}

export function ClothingSets({
  avatarParts,
  currency,
  avatarComposition,
  onSelect,
}: Props) {
  const {
    sets,
    selectedClothingSet,
    actions: { selectClothingSet },
  } = useClothingSets({
    compositionGender: getCompositionGender(avatarComposition),
    avatarParts,
    avatarComposition,
  });

  const handleSelectSet = useCallback(
    (setName: string, parts: AvatarPart[]) => {
      onSelect(setName, parts);
      selectClothingSet(setName);
    },
    [selectClothingSet, onSelect],
  );

  return (
    <>
      <div className={styles.outfitInfo}>
        <Icon
          className={styles.infoIcon}
          icon={FaInfoCircle}
          size={20}
        />
        <p className={styles.infoLabel}>
          Selecting outfit resets all your currently selected accesories
        </p>
      </div>

      <CategoryTitle
        currency={currency}
        icon={CoreAssets.Icons.Outfit}
        title="Outfits"
      />

      <div className={styles.outfitList}>
        <div className={styles.setItems}>
          {[...sets.keys()].map((set) => {
            const parts = sets.get(set) ?? null;
            if (!parts) {
              return null;
            }
            return (
              <SetGridItem
                avatarParts={parts}
                key={set}
                selected={selectedClothingSet === set}
                setName={set}
                onSelect={(setName) => handleSelectSet(setName, parts)}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
