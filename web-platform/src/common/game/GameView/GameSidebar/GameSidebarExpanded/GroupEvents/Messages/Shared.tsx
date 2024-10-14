import { flip, offset } from '@floating-ui/dom';
import { useFloating, autoUpdate, FloatingPortal } from '@floating-ui/react';
import { GameCard, GameCardProps } from '@noice-com/card-game';
import classNames from 'classnames';
import React, { useEffect } from 'react';

import styles from './Shared.module.css';

interface Props {
  cardData: GameCardProps['card'];
  points: number;
  containerRef: React.RefObject<HTMLElement>;
  show: boolean;
}

export const FloatingCard = ({
  cardData,
  points,
  containerRef,
  show,
}: Props): React.JSX.Element | null => {
  const portalElement = document.getElementById('portals');
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    strategy: 'fixed',
    middleware: [offset(8), flip()],
  });

  useEffect(() => {
    if (containerRef?.current) {
      refs.setReference(containerRef.current);
    }
  }, [containerRef, refs]);

  if (!portalElement || !show) {
    return null;
  }

  return (
    <FloatingPortal root={portalElement}>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
      >
        <div className={classNames(styles.card, { [styles.show]: show })}>
          <GameCard card={{ ...cardData, pointsMin: points }} />
        </div>
      </div>
    </FloatingPortal>
  );
};
