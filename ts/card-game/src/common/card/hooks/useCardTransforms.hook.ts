import { Point2D } from '@noice-com/common-ui';
import { MathUtils } from '@noice-com/utils';
import { CSSProperties } from 'react';

const ROTATE_DEGREE_SCALE = 5;
const IMAGE_TRANSLATE_SCALE = 25;

interface Props {
  positionOnCard: Point2D;
}

export const useCardTransforms = ({ positionOnCard }: Props): CSSProperties => {
  const rotateX =
    1 *
    MathUtils.transformRange(
      positionOnCard.y,
      0,
      1,
      -1 * ROTATE_DEGREE_SCALE,
      ROTATE_DEGREE_SCALE,
    );

  const rotateY =
    -1 *
    MathUtils.transformRange(
      positionOnCard.x,
      0,
      1,
      -1 * ROTATE_DEGREE_SCALE,
      ROTATE_DEGREE_SCALE,
    );

  const translateX =
    -1 *
    MathUtils.transformRange(
      positionOnCard.x,
      0,
      1,
      -1 * IMAGE_TRANSLATE_SCALE,
      IMAGE_TRANSLATE_SCALE,
    );

  const translateY =
    -1 *
    MathUtils.transformRange(
      positionOnCard.y,
      0,
      1,
      -1 * IMAGE_TRANSLATE_SCALE,
      IMAGE_TRANSLATE_SCALE,
    );

  const bgPositionX = positionOnCard.x * 100;
  const bgPositionY = positionOnCard.y * 100;

  const cssVariables = {
    '--game-card-rotate-x': `${rotateX}deg`,
    '--game-card-rotate-y': `${rotateY}deg`,
    '--game-card-translate-x': `${translateX}px`,
    '--game-card-translate-y': `${translateY}px`,
    '--game-card-holo-bg-position': `${bgPositionX}% ${bgPositionY}%`,
    '--game-card-rotate-border-angle': `${rotateX * 9 + rotateY * 9}deg`,
  } as CSSProperties;

  return cssVariables;
};
