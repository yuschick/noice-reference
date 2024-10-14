import { gql } from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import { getLevelGroup, getLevelGroupClassName } from '../utils';

import styles from './GameCardFrame.module.css';

import CreatorCardPattern from '@game-assets/images/card-creator-pattern.png';
import FrameBorderMask from '@game-assets/images/frameBorder.png';
import Lvl6BackGlow from '@game-assets/images/levelgroup6-backglow.png';
import { GameCardFrameCardFragment, GameCardFrameStreamerCardFragment } from '@game-gen';

interface Props {
  className?: string;
  card: GameCardFrameCardFragment;
  streamerCard: Nullable<GameCardFrameStreamerCardFragment>;
  forwardRef?: React.Ref<HTMLDivElement>;
  isHovering?: boolean;
}

const getLevelGroupFrameImageUrl = (level: number): string => {
  return `${NOICE.CDN_URL}/card-levels/v10/levelgroup${getLevelGroup(level)}.png`;
};

const getLevelGroupShineImageUrl = (level: number): string => {
  if (level > 39) {
    return `${NOICE.CDN_URL}/card-shines/v12/levelgroup${getLevelGroup(level)}.gif`;
  } else {
    return `${NOICE.CDN_URL}/card-shines/v12/levelgroup${getLevelGroup(level)}.png`;
  }
};

export function GameCardFrame({
  className,
  card,
  streamerCard,
  children,
  forwardRef,
  isHovering,
}: WithChildren<Props>) {
  const level = card.leveling.currentLevel;
  const { image: streamerCardImageUrl } = streamerCard ?? {};
  const frameImageUrl = streamerCardImageUrl || getLevelGroupFrameImageUrl(level);
  const shineImageUrl = streamerCardImageUrl
    ? `${NOICE.CDN_URL}/card-shines/v11/creator.png`
    : getLevelGroupShineImageUrl(level);

  const levelGroupClassName = getLevelGroupClassName(level);

  return (
    <div
      className={classNames(
        styles.gameCardFrameRoot,
        className,
        {
          [styles.isStreamerCard]: !!streamerCardImageUrl,
          [styles.isHovering]: isHovering,
        },
        styles[levelGroupClassName],
      )}
      ref={forwardRef}
      style={
        {
          '--game-card-frame-image-url': `url(${frameImageUrl})`,
          '--game-card-frame-shine-pattern-image-url': `url(${shineImageUrl})`,
          '--game-card-frame-border-mask-image-url': `url(${FrameBorderMask})`,
          '--game-card-frame-backglow': `url(${Lvl6BackGlow})`,
          '--game-card-frame-creator-pattern-url': `url(${CreatorCardPattern})`,
        } as CSSProperties
      }
    >
      {!!streamerCardImageUrl && <div className={styles.streamerBlurredFrame}></div>}
      <div className={styles.gameCardFramePattern} />

      {children}
    </div>
  );
}

GameCardFrame.fragments = {
  streamerCard: gql`
    fragment GameCardFrameStreamerCard on GameLogicStreamerCard {
      id
      image
    }
  `,
  card: gql`
    fragment GameCardFrameCard on GameLogicCard {
      leveling {
        currentLevel
      }
    }
  `,
};
