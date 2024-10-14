import { useCardTransforms } from '@noice-com/card-game';
import { Point2D } from '@noice-com/common-ui';
import { CSSProperties } from 'react';

interface Props {
  positionOnCard: Point2D;
}

const RANDOM_SHINE_POSITION = Math.random() * -40;

export function useCardBacksideTransforms({ positionOnCard }: Props): CSSProperties {
  const cssTransformVars = useCardTransforms({ positionOnCard });

  const bgPositionX = positionOnCard.x * 8;
  const bgPositionY = positionOnCard.y * 85;

  const cssBacksideVariables = {
    ...cssTransformVars,
    '--game-card-translate-x': `${positionOnCard.x * 85}%`,
    '--game-card-translate-y': `${positionOnCard.y * 125}%`,
    '--game-card-holo-bg-position': `${RANDOM_SHINE_POSITION - 50 + bgPositionX}% ${
      RANDOM_SHINE_POSITION + bgPositionY * (bgPositionX * 0.2)
    }%`,
    '--game-card-holo-bg-position-2': `${
      RANDOM_SHINE_POSITION - 50 + bgPositionX * -1
    }% ${RANDOM_SHINE_POSITION + bgPositionY * (bgPositionX * -0.2)}%`,
  } as CSSProperties;

  return cssBacksideVariables;
}
