import { NoiceLogo } from '@noice-com/common-ui';
import classNames from 'classnames';

import { BaseLayout } from './BaseLayout/BaseLayout';
import { Header } from './BaseLayout/Header/Header';
import { CardGameEvent } from './CardGameEvent/CardGameEvent';
import styles from './CardGameEvents.module.css';

import {
  AlertComponentBaseProps,
  AlertProps,
  AlertsList,
  useCurrentAlertDuration,
  useRenderedAlertsList,
} from '@common/alerts';

interface Props extends AlertComponentBaseProps {
  alerts: AlertsList;
  onAlertCompleted(id: string): void;
  onAlertShown?(id: string): void;
}

const getTexts = (alert: AlertProps) => {
  if (alert.data.__typename === 'StreamerChannelActivityEvent') {
    const alertContent = alert.data.content;

    if (!alertContent) {
      return { text: '', subtext: '' };
    }

    if (alertContent.__typename === 'GameLogicHighScoringCardPromotedMsg') {
      return { text: 'Top score', subtext: alertContent.hscPlayer.userTag };
    }
  }

  if (alert.data.__typename === 'MatchTopCardsUpdateCardCountUpdate') {
    return { text: 'Most predicted' };
  }

  return { text: '', subtext: '' };
};

export function CardGameEvents({
  alerts,
  onAlertCompleted,
  onAlertShown,
  ...baseProps
}: Props) {
  const { renderedAlerts } = useRenderedAlertsList({ alerts });
  useCurrentAlertDuration({ renderedAlerts, onAlertCompleted });

  if (!renderedAlerts.length) {
    return null;
  }

  return (
    <BaseLayout>
      <div className={styles.headerContainer}>
        <div className={styles.noiceLogoContainer}>
          <NoiceLogo
            theme="spectrum"
            variant="mark"
          />
        </div>

        <div className={styles.headersWrapper}>
          {renderedAlerts.map((alert) => {
            const isDisappearing = !!alert.onDisappeared;
            const texts = getTexts(alert);

            return (
              <div
                className={classNames(styles.headerTextsContainer, {
                  [styles.headerTextsDisappear]: isDisappearing,
                  [styles.headerTextsAppear]: !isDisappearing,
                })}
                key={`header-${alert.id}`}
              >
                <Header
                  subtext={texts.subtext}
                  text={texts.text}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.streamMiniHighlightsContentWrapper}>
        {renderedAlerts.map((alert) => {
          const isDisappearing = !!alert.onDisappeared;

          const disappearType = isDisappearing
            ? renderedAlerts.length < 2
              ? 'slow'
              : 'fast'
            : undefined;

          return (
            <CardGameEvent
              alert={alert}
              {...baseProps}
              disappearType={disappearType}
              key={alert.id}
              onAlertShown={() => onAlertShown?.(alert.id)}
              onDisappeared={alert.onDisappeared}
            />
          );
        })}
      </div>
    </BaseLayout>
  );
}
