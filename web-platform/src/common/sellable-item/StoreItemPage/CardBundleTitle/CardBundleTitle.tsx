import { gql } from '@apollo/client';
import { Breakpoint, CommonUtils } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './CardBundleTitle.module.css';

import { UserWalletDisplay } from '@common/wallet';
import { CardBundleTitleGameFragment } from '@gen';

gql`
  fragment CardBundleTitleGame on GameGame {
    name
    activeSeason {
      id
      name
      endTime
    }
  }
`;

interface Props {
  game: Nullable<CardBundleTitleGameFragment>;
  storeItemName: string;
  showSuccessState: boolean;
}

export function CardBundleTitle({ storeItemName, game, showSuccessState }: Props) {
  return (
    <div className={styles.titleWrapper}>
      <Breakpoint query={`(max-width: ${CommonUtils.getRem(1099)})`}>
        <UserWalletDisplay />
      </Breakpoint>

      <h1 className={styles.title}>
        {showSuccessState ? (
          <>
            <span className={styles.subtitle}>&nbsp;</span>
          </>
        ) : (
          <>
            <div className={styles.subtitle}>
              <span className={classNames(styles.highlight, styles.previewing)}>
                Previewing
              </span>{' '}
              <span>{storeItemName}</span> <span>for</span>
            </div>
          </>
        )}

        {showSuccessState ? (
          <>
            <span className={styles.highlight}>Items</span>&nbsp;Acquired
          </>
        ) : (
          <>{game?.name} creators</>
        )}
      </h1>

      {!!game && (
        <div className={styles.seasonInfoWrapper}>
          <span>{game.activeSeason.name}</span>

          {/* @todo format the time*/}
          {/* {showSuccessState && (
            <div className={styles.remainingTime}>
              <Icon
                icon={FaRegClock}
                size={24}
              />
              <time
                dateTime={DateAndTimeUtils.getHTMLAttributeTime(
                  game.activeSeason.endTime,
                )}
              >
                {game.activeSeason.endTime}
              </time>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
