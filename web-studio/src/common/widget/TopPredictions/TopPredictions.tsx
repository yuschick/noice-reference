import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { parseDescription, parseChallengeDescription } from '@noice-com/card-game';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect } from 'react';

import { useWidgetMenu } from '../context';

import { useChallenges } from './hooks/useChallenges.hook';
import styles from './TopPredictions.module.css';
import { TopPredictionsSettings } from './TopPredictionsSettings';

import { useListenStudioLocalStorageValue } from '@common/local-storage';
import { useStreamContext } from '@common/stream';
import { WidgetId, LiveChannelWidgetProps } from '@common/widget/types';
import {
  GameLogicChallengeState,
  TopPredictionsDocument,
  TopPredictionsSubscription,
  TopPredictionsSubscriptionVariables,
} from '@gen';

gql`
  subscription TopPredictions($streamId: ID!) {
    streamTopActiveCardsSubscribe(streamId: $streamId) {
      content {
        ... on MatchTopCardsUpdateCardCountUpdate {
          cards {
            cardId
            card {
              id
              ...TopActiveCard
            }
            count
          }
        }
      }
    }
  }

  fragment TopActiveCard on GameLogicCard {
    id
    name
    description
    targetValue
    timerDuration
    ...GameStateCardTargetValues
  }
`;

export function TopPredictions({ streamId }: LiveChannelWidgetProps) {
  const [showDescriptions = true, setShowDescriptions] = useListenStudioLocalStorageValue(
    'topPredictions.showDescriptions',
  );
  const [fontSize = 'medium', setFontSize] = useListenStudioLocalStorageValue(
    'topPredictions.fontSize',
  );
  const { setSettings } = useWidgetMenu();
  const { challenges, isLoading: loadingChallenges } = useChallenges({ streamId });
  const { isChallengesEnabled } = useStreamContext();

  const { data, loading: loadingTopPredictions } = useRestartingSubscription<
    TopPredictionsSubscription,
    TopPredictionsSubscriptionVariables
  >(TopPredictionsDocument, {
    variables: { streamId },
    skip: !streamId,
  });

  const predictions =
    data?.streamTopActiveCardsSubscribe?.content?.__typename ===
    'MatchTopCardsUpdateCardCountUpdate'
      ? data.streamTopActiveCardsSubscribe.content.cards
      : [];

  useEffect(() => {
    const settings = (
      <TopPredictionsSettings
        fontSize={fontSize}
        key={`${WidgetId.TopPredictions}-${streamId}`}
        setFontSize={setFontSize}
        setShowDescriptions={setShowDescriptions}
        showDescriptions={showDescriptions}
      />
    );

    setSettings(settings);
  }, [
    fontSize,
    setFontSize,
    setSettings,
    setShowDescriptions,
    showDescriptions,
    streamId,
  ]);

  const loading = loadingTopPredictions || loadingChallenges;

  if (!loading && !predictions.length && (!challenges.length || !isChallengesEnabled)) {
    return (
      <div className={styles.emptyContainer}>
        <Icon
          icon={CoreAssets.Icons.Cards}
          size={24}
        />
        <p>Waiting for players to make their predictions</p>
      </div>
    );
  }

  const showChallenges = isChallengesEnabled && !loading;

  return (
    <>
      {!!predictions.length && (
        <section className={classNames(styles.topPredictionsWrapper, styles[fontSize])}>
          <span className={styles.sectionTitle}>Predictions</span>
          <ul className={styles.topPredictionsList}>
            {predictions.map(({ card, count }) => (
              <li
                className={styles.topPredictionItem}
                key={card.id}
              >
                <span className={styles.predictionAmount}>{count}</span>

                <div className={styles.predictionDetailsWrapper}>
                  <span className={styles.predictionTitle}>{card.name}</span>
                  {showDescriptions && (
                    <p className={styles.predictionDescription}>
                      {parseDescription(card)}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showChallenges && !!challenges.length && (
        <section className={classNames(styles.topChallengesWrapper, styles[fontSize])}>
          <span className={styles.sectionTitle}>Challenges</span>
          <ul className={styles.topChallengesList}>
            {challenges.map((challenge) => (
              <li
                className={styles.topChallengeItem}
                key={challenge.id}
                style={
                  {
                    '--_pick-rate-progress': challenge.pickRatePercentage / 100,
                  } as CSSProperties
                }
              >
                <div className={styles.pickRateWrapper}>
                  <span>{challenge.pickRatePercentage}%</span>
                  <div className={styles.pickRateAbsoluteWrapper}>
                    <Icon
                      className={styles.icon}
                      icon={CoreAssets.Icons.User}
                    />
                    <span>{challenge.pickRate}</span>
                  </div>
                </div>
                <p className={styles.challengeDescription}>
                  {parseChallengeDescription(
                    challenge.description,
                    challenge.targetValues || [],
                  )}
                </p>
                <div className={styles.challengeState}>
                  {challenge.challengeState ===
                    GameLogicChallengeState.ChallengeStateSuccess && (
                    <span className={styles.success}>Success</span>
                  )}

                  {challenge.challengeState ===
                    GameLogicChallengeState.ChallengeStateFailure && (
                    <span className={styles.fail}>Fail</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
