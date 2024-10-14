import { gql } from '@apollo/client';
import classNames from 'classnames';

import styles from './GameCardInfoDescription.module.css';

import {
  getCorrectTargetValuesByGlobals,
  getPlaceholderValue,
  normalizeTargetValues,
  parseGlobals,
  splitDescription,
} from '@game-common/card';
import { GameCardInfoDescriptionCardFragment } from '@game-gen';
import { CGActiveCard } from '@game-logic/card';
import { useGlobals } from '@game-logic/game/hooks/useGlobals.hook';

interface Props {
  card: GameCardInfoDescriptionCardFragment;
  showNumbersOnSmallCard?: boolean;
}

export function GameCardInfoDescription({ card, showNumbersOnSmallCard }: Props) {
  const globals = useGlobals();
  const { description, targetValue, timerDuration, targetValues } = card;

  const normalizedTargetValues = normalizeTargetValues(targetValues);
  const targetValuesByGlobals = getCorrectTargetValuesByGlobals(
    normalizedTargetValues,
    globals,
  );
  const descriptionWithGlobalsParsed = parseGlobals(description, globals);
  const descriptionInParts = splitDescription(descriptionWithGlobalsParsed);

  return (
    <p
      className={classNames(styles.gameCardInfoDescriptionWrapper, {
        [styles.hideNumbersOnSmallCard]: !showNumbersOnSmallCard,
      })}
    >
      {descriptionInParts.map((part, i) => {
        const key = `${part}-${i}`;
        const value = getPlaceholderValue(part, {
          targetValue,
          timerDuration,
          targetValues: targetValuesByGlobals,
        });

        if (value !== null) {
          return (
            <span
              className={styles.gameCardInfoDescriptionNumber}
              key={key}
            >
              {value}
            </span>
          );
        }

        return (
          <span
            className={styles.gameCardInfoDescriptionText}
            key={key}
          >
            {part}
          </span>
        );
      })}
    </p>
  );
}

GameCardInfoDescription.fragments = {
  card: gql`
    fragment GameCardInfoDescriptionCard on GameLogicCard {
      description
      targetValue
      timerDuration
      ...GameStateCardTargetValues
    }
    ${CGActiveCard.Fragments.targetValues}
  `,
};
