import { gql } from '@apollo/client';
import { CommonUtils, Image } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import { getLevelGroupClassName } from '../utils';

import styles from './GameCardHero.module.css';

import { GameCardHeroCardFragment } from '@game-gen';

interface Props {
  className?: string;
  card: GameCardHeroCardFragment;
  isHovering?: boolean;
  isMouseLeaving?: boolean;
}

export function GameCardHero({ className, card, isHovering, isMouseLeaving }: Props) {
  const { icon } = card;

  if (!icon) {
    return null;
  }
  const level = card.leveling.currentLevel;
  const levelGroupClassName = getLevelGroupClassName(level);

  return (
    <div
      className={classNames(
        styles.gameCardHeroWrapper,
        className,
        {
          [styles.isHovering]: isHovering,
          [styles.mouseIsLeaving]: isMouseLeaving,
        },
        styles[levelGroupClassName],
      )}
      style={
        {
          '--game-card-hero-mask': `url(${icon})`,
        } as CSSProperties
      }
    >
      <Image
        alt=""
        className={styles.gameCardHero}
        draggable={false}
        loadingType="none"
        sizes={`
            (max-width: ${CommonUtils.getRem(600)}) 50vw,
            (max-width: ${CommonUtils.getRem(792)}) 40vw,
            (max-width: ${CommonUtils.getRem(1200)}) 25vw,
            (max-width: ${CommonUtils.getRem(1700)}) 15vw,
            7vw
          `}
        src={icon}
      />
      {isHovering && <div className={styles.heroArtHoverEffect}></div>}
    </div>
  );
}

GameCardHero.fragments = {
  card: gql`
    fragment GameCardHeroCard on GameLogicCard {
      leveling {
        currentLevel
      }
      icon
    }
  `,
};
