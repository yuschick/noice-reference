import { useMountEffect } from '@noice-com/common-react-core';
import { useAnalytics } from '@noice-com/common-ui';
import classNames from 'classnames';
import { SyntheticEvent, useRef } from 'react';

import { CardGameEventDisappearType } from '../types';

import styles from './CardGameEvent.module.css';
import { HighScoringCard } from './HighScoringCard/HighScoringCard';
import { MostPredictedCard } from './MostPredictedCard/MostPredictedCard';

import { AlertComponentBaseProps, AlertProps, AlertsUtils } from '@common/alerts';

interface Props extends AlertComponentBaseProps {
  alert: AlertProps;
  disappearType?: CardGameEventDisappearType;
  onDisappeared?(): void;
  onAlertShown?(): void;
}

export function CardGameEvent({
  alert,
  disappearType,
  onDisappeared,
  onAlertShown,
  ...baseProps
}: Props) {
  const { trackEvent } = useAnalytics();

  const containerRef = useRef(null);

  const handleAnimationEnd = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.target !== containerRef.current) {
      return;
    }

    onDisappeared?.();
  };

  useMountEffect(() => {
    onAlertShown?.();

    if (
      alert.data.__typename === 'MatchTopCardsUpdateCardCountUpdate' &&
      alert.data.cards.length
    ) {
      const card = AlertsUtils.getCardWithHighestCount(alert);

      if (!card) {
        return;
      }

      trackEvent({
        streamAlertItemShown: {
          ...baseProps,
          topPrediction: card,
          alertItemId: alert.id,
        },
      });

      return;
    }

    if (alert.data.__typename !== 'StreamerChannelActivityEvent') {
      return;
    }

    const alertContent = alert.data.content;

    if (!alertContent) {
      return;
    }

    if (alertContent.__typename === 'GameLogicHighScoringCardPromotedMsg') {
      trackEvent({
        streamAlertItemShown: {
          ...baseProps,
          highScoringCard: alertContent,
          alertItemId: alert.id,
        },
      });
    }
  });

  const renderAlert = (alert: AlertProps) => {
    if (alert.data.__typename === 'StreamerChannelActivityEvent') {
      const alertContent = alert.data.content;

      if (!alertContent) {
        return null;
      }

      if (alertContent.__typename === 'GameLogicHighScoringCardPromotedMsg') {
        return (
          <HighScoringCard
            boosterIds={alertContent.card.boosterPoints.map((points) => points.boosterId)}
            card={alertContent.card.card}
            player={alertContent.hscPlayer}
            points={alertContent.card.points}
          />
        );
      }
    }

    if (
      alert.data.__typename === 'MatchTopCardsUpdateCardCountUpdate' &&
      alert.data.cards.length
    ) {
      const card = AlertsUtils.getCardWithHighestCount(alert);

      if (!card) {
        return null;
      }
      return <MostPredictedCard card={card} />;
    }

    return null;
  };

  return (
    <div
      className={classNames(styles.streamMiniHighlightContentItemContainer, {
        [styles.disappearFast]: disappearType === 'fast',
        [styles.disappearSlow]: disappearType === 'slow',
      })}
      ref={containerRef}
      onAnimationEnd={handleAnimationEnd}
    >
      {renderAlert(alert)}
    </div>
  );
}
