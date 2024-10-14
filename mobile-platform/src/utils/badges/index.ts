import { FC } from 'react';
import { ImageSourcePropType } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { default as SeasonRankBadgeGold } from '@assets/images/badges/rank-badge-gold.svg';
import { default as SeasonRankBadgeMagenta } from '@assets/images/badges/rank-badge-magenta.svg';
import { default as SeasonRankBadgeSpectrum } from '@assets/images/badges/rank-badge-spectrum.svg';
import { default as SeasonRankBadgeTeal } from '@assets/images/badges/rank-badge-teal.svg';
import { default as SeasonRankBadgeViolet } from '@assets/images/badges/rank-badge-violet.svg';
import { ImageAssets } from '@utils/image';

type Level = 'gold' | 'spectrum' | 'magenta' | 'violet' | 'teal';

export const badges = {
  seasonRankBadgeGold: SeasonRankBadgeGold,
  seasonRankBadgeMagenta: SeasonRankBadgeMagenta,
  seasonRankBadgeSpectrum: SeasonRankBadgeSpectrum,
  seasonRankBadgeTeal: SeasonRankBadgeTeal,
  seasonRankBadgeViolet: SeasonRankBadgeViolet,
};

export const getRankMeta = (
  rank: number,
): { level: Level; idleVFX: ImageSourcePropType; badge: FC<SvgProps> } => {
  if (rank < 25) {
    return {
      level: 'teal',
      badge: badges.seasonRankBadgeTeal,
      idleVFX: ImageAssets.seasonRankBadgeTealIdleVfx,
    };
  }

  if (rank >= 25 && rank < 50) {
    return {
      level: 'violet',
      badge: badges.seasonRankBadgeViolet,
      idleVFX: ImageAssets.seasonRankBadgeVioletIdleVfx,
    };
  }

  if (rank >= 50 && rank < 75) {
    return {
      level: 'magenta',
      badge: badges.seasonRankBadgeMagenta,
      idleVFX: ImageAssets.seasonRankBadgeMagentaIdleVfx,
    };
  }

  if (rank >= 75 && rank < 99) {
    return {
      level: 'spectrum',
      badge: badges.seasonRankBadgeSpectrum,
      idleVFX: ImageAssets.seasonRankBadgeSpectrumIdleVfx,
    };
  }

  return {
    level: 'gold',
    badge: badges.seasonRankBadgeGold,
    idleVFX: ImageAssets.seasonRankBadgeGoldIdleVfx,
  };
};
