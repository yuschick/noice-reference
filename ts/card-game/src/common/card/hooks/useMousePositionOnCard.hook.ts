import { Point2D } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import { usePlaySound } from '@game-common/sound/hooks';
import { GameSoundKeys } from '@game-types';

interface HookResult {
  positionOnCard: Point2D;
  isHovering: boolean;
}

interface Props {
  card: React.RefObject<HTMLElement>;
}

const defaultPositionOnCard: Point2D = { x: 0.5, y: 0.5 };

export const useMousePositionOnCard = ({ card }: Props): HookResult => {
  const [isHovering, setIsHovering] = useState(false);
  const [positionOnCard, setPositionOnCard] = useState<Point2D>(defaultPositionOnCard);

  const [playHoverSound] = usePlaySound(GameSoundKeys.CardHover);

  useEffect(() => {
    const cardElement = card.current;

    if (!cardElement) {
      return;
    }

    const onMouseEnter = () => {
      setIsHovering(true);
      playHoverSound();
    };

    const onMouseMove = (event: MouseEvent) => {
      const cardRect = cardElement.getBoundingClientRect();

      const x = event.clientX - cardRect.x;
      const y = event.clientY - cardRect.y;

      if (x < 0 || y < 0) {
        return;
      }

      setPositionOnCard({
        x: x / cardRect.width,
        y: y / cardRect.height,
      });
    };

    const onMouseLeave = () => {
      setIsHovering(false);
      setPositionOnCard(defaultPositionOnCard);
    };

    cardElement.addEventListener('mousemove', onMouseMove);
    cardElement.addEventListener('mouseenter', onMouseEnter);
    cardElement.parentElement?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cardElement.removeEventListener('mousemove', onMouseMove);
      cardElement.removeEventListener('mouseenter', onMouseEnter);
      cardElement.parentElement?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [playHoverSound, card]);

  return { positionOnCard, isHovering };
};
