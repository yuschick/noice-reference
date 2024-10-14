import { gql } from '@apollo/client';
import { StringUtils } from '@noice-com/utils';

import styles from './Stats.module.css';

import { ContentModulePage } from '@common/page-components';
import { UserStatsFragment } from '@gen';

interface Props {
  stats: UserStatsFragment;
}

export function Stats({ stats }: Props) {
  const gameplay = (({
    matchesPlayed,
    timePlayed,
    cardsPlayed,
    shufflesUsed,
    cardsSucceeded,
  }) => ({
    matchesPlayed,
    timePlayed,
    cardsPlayed,
    shufflesUsed,
    cardsSucceeded,
  }))(stats);

  const metagame = (({
    dailyGoalCardsCompleted,
    dailyGoalCardsSet,
    cardBundlesPurchased,
    adsWatched,
    cardLevelUps,
    currencySpending,
  }) => ({
    dailyGoalCardsCompleted,
    dailyGoalCardsSet,
    cardBundlesPurchased,
    adsWatched,
    cardLevelUps,
    softCurrencyUsed: currencySpending?.softCurrency,
    hardCurrencyUsed: currencySpending?.hardCurrency,
  }))(stats);

  const boosters = { ...stats.boosterUsage };
  delete boosters['__typename'];

  const data = {
    gameplay,
    boosters,
    metagame,
  };

  return (
    <ContentModulePage.Content title="Stats">
      <div className={styles.wrapper}>
        {Object.entries(data).map(([title, data]) => (
          <div key={title}>
            <h3 className={styles.title}>{StringUtils.normalizePropertyName(title)}</h3>

            <ul className={styles.list}>
              {Object.entries(data).map(([label, value]) => (
                <li
                  className={styles.listItem}
                  key={label}
                >
                  {StringUtils.normalizePropertyName(label)}{' '}
                  <span className={styles.value}>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ContentModulePage.Content>
  );
}

Stats.fragments = {
  entry: gql`
    fragment UserStats on PlayerStatsPlayerStats {
      matchesPlayed
      timePlayed
      cardsPlayed
      shufflesUsed
      cardsSucceeded

      dailyGoalCardsCompleted
      dailyGoalCardsSet
      cardBundlesPurchased
      adsWatched
      cardLevelUps
      currencySpending {
        softCurrency
        hardCurrency
        channelCurrency
      }

      boosterUsage {
        total
        doubt
        goodCall
        letsGo
        nextUp
        scavenge
        speedUp
      }
    }
  `,
};
