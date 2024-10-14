import { GameCard } from '@noice-com/card-game';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  SeasonRankBadge,
  useDialog,
  CurrencyIcon,
  WalletCurrencyId,
  CommonUtils,
  useContainerSize,
  Dialog,
  Button,
  VfxVideo,
  useAnalytics,
} from '@noice-com/common-ui';
import { AnalyticsEventClientRankUpDialogType } from '@noice-com/schemas/analytics/analytics.pb';
import classNames from 'classnames';

import { isReactNativeWebView } from '../../../embeds/bridge';

import styles from './SeasonRankUpDialog.module.css';

import goldRankUpgradeVfxMp4 from '@assets/vfx/rank-upgrades/gold-rank-upgrade-vfx.mp4';
import goldRankUpgradeVfxWebm from '@assets/vfx/rank-upgrades/gold-rank-upgrade-vfx.webm';
import magentaRankUpgradeVfxMp4 from '@assets/vfx/rank-upgrades/magenta-rank-upgrade-vfx.mp4';
import magentaRankUpgradeVfxWebm from '@assets/vfx/rank-upgrades/magenta-rank-upgrade-vfx.webm';
import spectralRankUpgradeVfxMp4 from '@assets/vfx/rank-upgrades/spectral-rank-upgrade-vfx.mp4';
import spectralRankUpgradeVfxWebm from '@assets/vfx/rank-upgrades/spectral-rank-upgrade-vfx.webm';
import backgroundVfxVideoMp4 from '@assets/vfx/season-reward-dialog-bg-vfx.mp4';
import backgroundVfxVideoWebm from '@assets/vfx/season-reward-dialog-bg-vfx.webm';
import { UnclaimedSeasonRewardFragment } from '@gen';

const BREAKPOINT = 720;

export interface Props {
  level: number;
  rewards: UnclaimedSeasonRewardFragment[];
  context: AnalyticsEventClientRankUpDialogType;
  onClose: () => void;
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

export function SeasonRankUpDialog({ level, rewards, context, onClose }: Props) {
  const store = useDialog({ title: 'Rank Up', onClose });
  const { inlineSize } = useContainerSize(store.state.dialogRef);
  const { trackEvent } = useAnalytics();
  const { rankVfx, rankClassName } = getRankVfx(level);
  const isEmbed = isReactNativeWebView();

  const season =
    rewards?.[0]?.reason?.reason?.__typename === 'ReasonReasonLevelUp'
      ? rewards?.[0]?.reason?.reason?.season
      : null;

  useMountEffect(() => {
    if (!season) {
      return;
    }
    trackEvent({
      clientRankUpDialogShown: {
        location: context,
      },
    });
    store.actions.open();
  });

  if (!season || isEmbed) {
    return null;
  }

  return (
    <Dialog store={store}>
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.contentWrapper}>
          <VfxVideo
            className={styles.backgroundVideoWrapper}
            delay={100}
            src={backgroundVfxVideos}
            isPlaying
          />
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
                rank={level}
                size={inlineSize && inlineSize < BREAKPOINT ? 'lg' : 'xl'}
              />
            </div>
            <div className={styles.seasonTextWrapper}>
              <span className={styles.seasonName}>{season.name}</span>
              <span className={styles.seasonNameDescription}>
                For {season.game.name} Creators
              </span>
            </div>
          </div>
          <div className={styles.dialogDivider} />
          <div className={styles.rewards}>
            {rewards.map((reward, index) => {
              if (reward.type.reward?.__typename === 'RewardRewardTypeItem') {
                if (reward.type.reward.item.details?.__typename === 'GameLogicCard') {
                  return (
                    <div
                      className={classNames(styles.cardWrapper, styles.rewardUnit)}
                      key={`reward_${index}`}
                    >
                      <GameCard card={reward.type.reward.item.details} />
                    </div>
                  );
                }
              }

              if (reward.type.reward?.__typename === 'RewardRewardTypeCurrency') {
                return (
                  <div
                    className={classNames(styles.currencyReward, styles.rewardUnit)}
                    key={`reward_${index}`}
                  >
                    <CurrencyIcon
                      size={inlineSize && inlineSize < BREAKPOINT ? 'lg' : 'xl'}
                      type={
                        CommonUtils.getWalletCurrencyId(reward.type.reward.currencyId) ??
                        WalletCurrencyId.SoftCurrency
                      }
                    />
                    <span className={styles.currencyRewardText}>
                      {reward.type.reward.currencyAmount}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <div className={styles.actionWrapper}>
          <Button
            fit="container"
            size="lg"
            theme="dark"
            onClick={() => store.actions.close()}
          >
            {rewards.length === 1 ? 'Claim Reward' : 'Claim Rewards'}
          </Button>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
