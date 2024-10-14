import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { rarityBackgroundName } from '@noice-com/card-game';
import {
  CommonUtils,
  CurrencyIcon,
  TooltipPortal,
  Icon as CommonIcon,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useMemo, useRef } from 'react';

import styles from './GoalCard.module.css';

import { getRarityIcon } from '@common/goal-card';
import { GoalCardCardFragment, RarityRarity } from '@gen';

export interface Props {
  card: GoalCardCardFragment;
  onClick?(card: GoalCardCardFragment): void;
}

function getDailyGoalRarityBackground(rarity: RarityRarity): string {
  return `${NOICE.CDN_URL}/daily-goal-rarity-backgrounds/${rarityBackgroundName[rarity]}.jpg`;
}

export function GoalCard({ card, onClick }: Props) {
  const { description, reward, rarity, requiresTeam, target } = card;

  const groupRequirementRef = useRef<HTMLDivElement>(null);
  const cardImage = getDailyGoalRarityBackground(rarity);

  const currencyAmount = useMemo(
    () =>
      reward.reward?.__typename === 'RewardRewardTypeCurrency'
        ? reward.reward.currencyAmount
        : null,
    [reward.reward],
  );

  const currencyId = useMemo(
    () =>
      reward.reward?.__typename === 'RewardRewardTypeCurrency'
        ? CommonUtils.getWalletCurrencyId(reward.reward.currencyId)
        : null,
    [reward.reward],
  );

  const descriptionWithTarget = description.replace('{targetValue}', `${target}`);

  const Icon = getRarityIcon(rarity);
  const WrapperElement = onClick ? 'button' : 'div';

  return (
    <WrapperElement
      className={classNames(
        styles.container,
        styles[rarity.replace('RARITY_', '').toLowerCase()],
        { [styles.button]: !!onClick },
      )}
      style={
        {
          '--_card-image': `url('${cardImage}')`,
        } as CSSProperties
      }
      onClick={() => onClick?.(card)}
    >
      <div className={styles.cardHeader}>
        {requiresTeam && (
          <div
            className={styles.groupIndicator}
            data-ftue-anchor="soloPlay-dgc-group-card"
            ref={groupRequirementRef}
          >
            <CommonIcon
              color="light-main"
              icon={CoreAssets.Icons.Friends}
            />

            <TooltipPortal
              anchorRef={groupRequirementRef}
              className={styles.groupIndicatorTooltip}
              placement="top"
            >
              This daily goal can be completed only in team play mode
            </TooltipPortal>
          </div>
        )}

        <div className={styles.rarityLabel}>{rarity.split('_')[1]}</div>
        <Icon className={styles.rarityIcon} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.descriptionContainer}>{descriptionWithTarget}</div>

        <div className={styles.rewardContainer}>
          <div className={styles.rewardLabel}>Reward:</div>

          {!!currencyAmount && currencyId && (
            <div className={styles.currencyWrapper}>
              <CurrencyIcon
                size="sm"
                type={currencyId}
              />
              <span className={styles.currencyAmount}>{currencyAmount}</span>
            </div>
          )}
        </div>
      </div>
    </WrapperElement>
  );
}

GoalCard.fragments = {
  entry: gql`
    fragment GoalCardCard on GoalCardGoalCard {
      id
      description
      gameId
      rarity
      target
      requiresTeam
      game {
        id
        name
      }
      reward {
        reward {
          ... on RewardRewardTypeCurrency {
            currencyId
            currencyAmount
          }
        }
      }
    }
  `,
};
