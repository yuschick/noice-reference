import classNames from 'classnames';

import styles from './LightPillar.module.css';

import { RarityRarity } from '@gen';

export interface Props {
  rarity: RarityRarity;
}

export function LightPillar({ rarity }: Props) {
  return (
    <div
      className={classNames(styles.lightPillar, {
        [styles.common]: rarity === RarityRarity.RarityCommon,
        [styles.uncommon]: rarity === RarityRarity.RarityUncommon,
        [styles.rare]: rarity === RarityRarity.RarityRare,
        [styles.epic]: rarity === RarityRarity.RarityEpic,
        [styles.legendary]: rarity === RarityRarity.RarityLegendary,
      })}
    />
  );
}
