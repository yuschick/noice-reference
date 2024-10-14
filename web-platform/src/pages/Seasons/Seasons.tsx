import { gql } from '@apollo/client';
import { useConditionalOnce } from '@noice-com/common-react-core';
import { CommonSoundKeys } from '@noice-com/common-ui';
import { AnalyticsEventClientRankUpDialogType } from '@noice-com/schemas/analytics/analytics.pb';
import { Helmet } from 'react-helmet-async';

import { emitEmbeddedPageLoaded, isReactNativeWebView } from '../../embeds/bridge';

import { EmptyState } from './EmptyState/EmptyState';
import { GameSelector } from './GameSelector/GameSelector';
import { useSeasonsData } from './hooks/useSeasonsData.hook';
import { NextUnlock } from './NextUnlock/NextUnlock';
import { RewardTrack } from './RewardTrack/RewardTrack';
import styles from './Seasons.module.css';
import { SeasonsHeader } from './SeasonsHeader/SeasonsHeader';

import BackgroundImage1000Avif from '@assets/images/seasons/noice-seasons-bg-1000.avif';
import BackgroundImage1000WebP from '@assets/images/seasons/noice-seasons-bg-1000.webp';
import BackgroundImage1500Avif from '@assets/images/seasons/noice-seasons-bg-1500.avif';
import BackgroundImage1500WebP from '@assets/images/seasons/noice-seasons-bg-1500.webp';
import { usePlayedGameIds } from '@common/game';
import { PageBackgroundImage } from '@common/page';
import { SeasonBreakInfo } from '@common/season';
import { SeasonRankUpDialog } from '@common/season/SeasonRankUpDialog';
import { usePlaySound } from '@common/sound';
import { useSelectedUIState } from '@context';

gql`
  mutation SeasonClaimReward($rewardId: ID) {
    claimReward(rewardId: $rewardId) {
      emptyTypeWorkaround
    }
  }
`;

export function Seasons() {
  const { gameIds } = usePlayedGameIds();
  const { selectedGameId } = useSelectedUIState();
  const {
    levelConfigs,
    nextImportantLevel,
    progression,
    rewards,
    remainingDailyXpBoost,
    loading: seasonsDataLoading,
  } = useSeasonsData();
  const isEmbedded = isReactNativeWebView();
  const [playOpenRewardsSound] = usePlaySound(CommonSoundKeys.AssetReveal);

  const hasContent = !!levelConfigs && !!progression && !!rewards;

  useConditionalOnce(() => {
    emitEmbeddedPageLoaded();
  }, isEmbedded && !seasonsDataLoading);

  return (
    <>
      <Helmet>
        <title>Seasons</title>
      </Helmet>

      <PageBackgroundImage
        sources={[
          {
            srcSet: `${BackgroundImage1000Avif} 1000w, ${BackgroundImage1500Avif} 1500w`,
          },
          {
            srcSet: `${BackgroundImage1000WebP} 1000w, ${BackgroundImage1500WebP} 1500w`,
          },
        ]}
        src={BackgroundImage1000Avif}
      />

      <article
        className={styles.seasonsWrapper}
        data-ftue-anchor="seasonView"
      >
        <header className={styles.seasonsHeaderWrapper}>
          {!isEmbedded && <h1 className={styles.seasonsHeading}>Seasons</h1>}
          {!!gameIds.length && <GameSelector gameIds={gameIds} />}
          <SeasonBreakInfo gameId={selectedGameId} />
        </header>

        <section>
          {seasonsDataLoading ? (
            <SeasonsHeader.Loading />
          ) : (
            <>{hasContent && progression ? <SeasonsHeader {...progression} /> : null}</>
          )}
        </section>

        <section className={styles.rewardsSectionWrapper}>
          {seasonsDataLoading ? (
            <RewardTrack.Loading />
          ) : (
            <>
              {hasContent ? (
                <RewardTrack
                  levelConfigs={levelConfigs}
                  progression={progression}
                  remainingDailyXpBoost={remainingDailyXpBoost}
                  rewards={rewards}
                />
              ) : (
                <EmptyState text="Play a card in a game to view your season progression" />
              )}
            </>
          )}

          {seasonsDataLoading ? (
            <NextUnlock.Loading />
          ) : (
            <>
              {hasContent && nextImportantLevel ? (
                <NextUnlock {...nextImportantLevel} />
              ) : null}
            </>
          )}
        </section>
        <SeasonRankUpDialog
          context={
            AnalyticsEventClientRankUpDialogType.ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_SEASONS
          }
          onClose={() => playOpenRewardsSound()}
        />
      </article>
    </>
  );
}
