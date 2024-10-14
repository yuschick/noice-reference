import { Sprite } from '../Sprite/Sprite';

import styles from './GlowRings.module.css';

import { RarityRarity } from '@gen';

export interface Props {
  rarity: RarityRarity;
}

export function GlowRings({ rarity }: Props) {
  return (
    <Sprite
      imageClass={styles.rings}
      name="glow-rings"
      rarity={rarity}
      type="fx"
      wrapperClass={styles.wrapper}
    />
  );
}
