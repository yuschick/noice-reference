import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { Image, useDialog, SeasonRankBadge, VfxVideo } from '@noice-com/common-ui';
import classNames from 'classnames';

import { SeasonDialogBase } from '../SeasonDialogBase/SeasonDialogBase';

import styles from './SeasonEndDialog.module.css';
import { StatsRow } from './StatsRow/StatsRow';

import goldRankUpgradeVfxMp4 from '@assets/vfx/rank-upgrades/gold-rank-upgrade-vfx.mp4';
import goldRankUpgradeVfxWebm from '@assets/vfx/rank-upgrades/gold-rank-upgrade-vfx.webm';
import magentaRankUpgradeVfxMp4 from '@assets/vfx/rank-upgrades/magenta-rank-upgrade-vfx.mp4';
import magentaRankUpgradeVfxWebm from '@assets/vfx/rank-upgrades/magenta-rank-upgrade-vfx.webm';
import spectralRankUpgradeVfxMp4 from '@assets/vfx/rank-upgrades/spectral-rank-upgrade-vfx.mp4';
import spectralRankUpgradeVfxWebm from '@assets/vfx/rank-upgrades/spectral-rank-upgrade-vfx.webm';
import backgroundVfxVideoMp4 from '@assets/vfx/season-reward-dialog-bg-vfx.mp4';
import backgroundVfxVideoWebm from '@assets/vfx/season-reward-dialog-bg-vfx.webm';
import {
  ItemItemType,
  SeasonEndDialogInventoryFragment,
  SeasonEndDialogProfileFragment,
  SeasonEndDialogProfileStatsFragment,
  SeasonEndDialogSeasonFragment,
} from '@gen';

interface Props {
  season: SeasonEndDialogSeasonFragment;
  profile: SeasonEndDialogProfileFragment;
  inventory: SeasonEndDialogInventoryFragment[];
  stats: SeasonEndDialogProfileStatsFragment;
  onClose(): void;
}

const magentaRankUpgradeVfxVideos = [magentaRankUpgradeVfxWebm, magentaRankUpgradeVfxMp4];
const spectralRankUpgradeVfxVideos = [
  spectralRankUpgradeVfxWebm,
  spectralRankUpgradeVfxMp4,
];
const goldRankUpgradeVfxVideos = [goldRankUpgradeVfxWebm, goldRankUpgradeVfxMp4];
const backgroundVfxVideos = [backgroundVfxVideoWebm, backgroundVfxVideoMp4];

const getRankVfx = (rank: number) => {
  if (rank < 25) {
    return { rankVfx: magentaRankUpgradeVfxVideos, rankClassName: 'tealVfx' };
  } else if (rank >= 25 && rank < 50) {
    return { rankVfx: magentaRankUpgradeVfxVideos, rankClassName: 'violetVfx' };
  } else if (rank >= 50 && rank < 75) {
    return { rankVfx: magentaRankUpgradeVfxVideos, rankClassName: 'magentaVfx' };
  } else if (rank >= 75 && rank < 99) {
    return { rankVfx: spectralRankUpgradeVfxVideos, rankClassName: 'spectralVfx' };
  } else {
    return { rankVfx: goldRankUpgradeVfxVideos, rankClassName: 'goldVfx' };
  }
};

export function SeasonEndDialog({ season, profile, inventory, stats, onClose }: Props) {
  const dialog = useDialog({ title: 'Season over', onClose });

  useMountEffect(() => {
    dialog.actions.open();
  });

  const { rankVfx, rankClassName } = getRankVfx(season.progression.level);

  const xpAmount = season.progression.xpAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const unlockedCardAmount =
    inventory.filter((item) => item.item.type === ItemItemType.TypeGameCard)?.length ?? 0;

  return (
    <SeasonDialogBase
      buttonText="Got it"
      dialogStore={dialog}
      season={season}
      slots={{
        backgroundVfxVideo: (
          <VfxVideo
            className={styles.backgroundVideoWrapper}
            delay={100}
            src={backgroundVfxVideos}
            isPlaying
            loop
          />
        ),
      }}
    >
      <div className={styles.contentRow}>
        <div className={styles.avatarContainer}>
          <Image
            className={styles.avatarImage}
            fit="cover"
            loading="eager"
            loadingType="none"
            src={profile.avatars?.avatarFullbody}
          />
        </div>
        <div className={styles.rankContainer}>
          <div className={classNames(styles.rankBadgeWrapper, styles[rankClassName])}>
            <VfxVideo
              className={styles.videoWrapper}
              delay={300}
              src={rankVfx}
              isPlaying
            />
            <SeasonRankBadge
              className={styles.rankBadgeIcon}
              rank={season.progression.level}
              size="xl"
            />
          </div>
          <div className={styles.playerNameWrapper}>
            <span className={styles.playerNameText}>{profile.userTag}</span>
            <span className={styles.finalRankText}>Final rank</span>
          </div>
        </div>
        <div className={styles.statsWrapper}>
          <StatsRow
            className={styles.statsRow}
            icon={CoreAssets.Icons.Collection}
            prefix={`${unlockedCardAmount} cards`}
            suffix="unlocked"
          />
          <StatsRow
            className={styles.statsRow}
            icon={CoreAssets.Icons.Seasons}
            prefix={`${xpAmount} XP`}
            suffix="earned"
          />
          <StatsRow
            className={styles.statsRow}
            icon={CoreAssets.Icons.Leaderboard}
            prefix={`${stats.matchesPlayed} matches`}
            suffix="played"
          />
        </div>
      </div>
    </SeasonDialogBase>
  );
}

SeasonEndDialog.fragments = {
  season: gql`
    fragment SeasonEndDialogSeason on GameSeason {
      id
      name
      progression(user_id: $userId) {
        seasonId
        level
        xpAmount
      }
      ...SeasonDialogBaseSeason
    }

    ${SeasonDialogBase.fragment.season}
  `,

  profile: gql`
    fragment SeasonEndDialogProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatarFullbody
      }
    }
  `,

  playerStats: gql`
    fragment SeasonEndDialogProfileStats on PlayerStatsPlayerStats {
      matchesPlayed
    }
  `,

  inventory: gql`
    fragment SeasonEndDialogInventory on InventoryInventoryItem {
      itemId
      item {
        id
        type
      }
    }
  `,
};
