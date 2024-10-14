import classNames from 'classnames';
import {
  CSSProperties,
  FunctionComponent,
  HTMLAttributes,
  SVGAttributes,
  useEffect,
  useState,
} from 'react';

import SeasonRankBadgeGold from './assets/rank-badge-gold.svg';
import SeasonRankBadgeMagenta from './assets/rank-badge-magenta.svg';
import SeasonRankBadgeSpectrum from './assets/rank-badge-spectrum.svg';
import SeasonRankBadgeTeal from './assets/rank-badge-teal.svg';
import SeasonRankBadgeViolet from './assets/rank-badge-violet.svg';
import SeasonRankBadgeGoldIdleVfx from './assets/vfx/rank-badge-idle-vfx-gold.png';
import SeasonRankBadgeMagentaIdleVfx from './assets/vfx/rank-badge-idle-vfx-magenta.png';
import SeasonRankBadgeSpectrumIdleVfx from './assets/vfx/rank-badge-idle-vfx-spectrum.png';
import SeasonRankBadgeTealIdleVfx from './assets/vfx/rank-badge-idle-vfx-teal.png';
import SeasonRankBadgeVioletIdleVfx from './assets/vfx/rank-badge-idle-vfx-violet.png';
import styles from './SeasonRankBadge.module.css';

type Level = 'gold' | 'spectrum' | 'magenta' | 'violet' | 'teal';
export const seasonRankBadgeSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  rank: number;
  size?: (typeof seasonRankBadgeSizes)[number];
  className?: string;
}

const rankBackgroundsMap: Record<Level, FunctionComponent<SVGAttributes<SVGElement>>> = {
  teal: SeasonRankBadgeTeal,
  violet: SeasonRankBadgeViolet,
  magenta: SeasonRankBadgeMagenta,
  spectrum: SeasonRankBadgeSpectrum,
  gold: SeasonRankBadgeGold,
};

const getRankMeta = (rank: number): { level: Level; idleVFX: string } => {
  if (rank < 25) {
    return { level: 'teal', idleVFX: SeasonRankBadgeTealIdleVfx };
  }

  if (rank >= 25 && rank < 50) {
    return { level: 'violet', idleVFX: SeasonRankBadgeVioletIdleVfx };
  }

  if (rank >= 50 && rank < 75) {
    return { level: 'magenta', idleVFX: SeasonRankBadgeMagentaIdleVfx };
  }

  if (rank >= 75 && rank < 99) {
    return { level: 'spectrum', idleVFX: SeasonRankBadgeSpectrumIdleVfx };
  }

  return { level: 'gold', idleVFX: SeasonRankBadgeGoldIdleVfx };
};

export function SeasonRankBadge({
  rank,
  size = 'md',
  className,
  ...htmlAttributes
}: Props) {
  const [badgeVFX, setBadgeVFX] = useState<string | null>(null);
  const { level, idleVFX } = getRankMeta(rank);

  const BadgeBackground = rankBackgroundsMap[level as Level];

  useEffect(() => {
    setBadgeVFX(idleVFX);

    setTimeout(() => {
      setBadgeVFX(null);
    }, 5250);
  }, [idleVFX]);

  return (
    <div
      {...htmlAttributes}
      className={classNames(
        styles.seasonRankBadgeWrapper,
        styles[size],
        styles[level],
        className,
      )}
      style={
        badgeVFX
          ? ({
              '--season-rank-badge-idle-vfx-url': `url(${badgeVFX})`,
            } as CSSProperties)
          : undefined
      }
    >
      <div
        aria-hidden="true"
        className={styles.vfx}
      />
      <BadgeBackground className={styles.seasonRankBadgeBackground} />
      <div className={styles.seasonRankBadgeDetailsWrapper}>
        <span className={styles.seasonRankBadgeRankLabel}>rank</span>
        <span>{rank}</span>
      </div>
    </div>
  );
}
