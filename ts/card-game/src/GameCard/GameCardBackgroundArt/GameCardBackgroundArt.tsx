import { gql } from '@apollo/client';
import { CommonUtils, Image } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import { getLevelGroupClassName } from '../utils';

import styles from './GameCardBackgroundArt.module.css';

import { MOUSE_IS_LEAVING_TRANSFORM_TRANSITION } from '@game-constants';
import {
  GameCardBackgroundArtCardFragment,
  GameCardBackgroundArtStreamerCardFragment,
  useGameCardBackgroundArtSeasonQuery,
} from '@game-gen';

interface Props {
  className?: string;
  card: GameCardBackgroundArtCardFragment;
  streamerCard: Nullable<GameCardBackgroundArtStreamerCardFragment>;
  isHovering: boolean;
  isMouseLeaving: boolean;
}

gql`
  query GameCardBackgroundArtSeason($seasonId: ID!) {
    season(id: $seasonId) {
      id
      cardBackgroundUrls {
        rarity
        url
      }
    }
  }
`;

export function GameCardBackgroundArt({
  className,
  card,
  streamerCard,
  isHovering,
  isMouseLeaving,
}: Props) {
  const { rarity, seasonId } = card;
  const { image: streamerCardImageUrl } = streamerCard ?? {};

  const { data } = useGameCardBackgroundArtSeasonQuery({
    variables: {
      seasonId,
    },
  });

  const bgImageUrl =
    data?.season?.cardBackgroundUrls.find((bg) => bg.rarity === rarity)?.url ?? '';

  // This should be eventually based on level-group

  const levelGroup5SparkleEffectUrl = `${NOICE.CDN_URL}/vfx-test/sparkles-2.gif`;
  const levelGroup6SparkleEffectUrl = `${NOICE.CDN_URL}/vfx-test/sparkles-3.gif`;

  const level = card.leveling.currentLevel;
  const levelGroupClassName = getLevelGroupClassName(level);

  return (
    <div
      className={classNames(styles.gameCardBgArtWrapper, className, {
        [styles.mouseIsLeaving]: isMouseLeaving,
        [styles.isHovering]: isHovering,
      })}
      style={
        {
          '--game-card-bg-art-mouse-is-leaving-transition': `${MOUSE_IS_LEAVING_TRANSFORM_TRANSITION}ms`,
        } as CSSProperties
      }
    >
      <div
        className={classNames(
          styles.gameCardBgArtContainer,
          styles.gameCardBgArtTransformContent,
          styles[levelGroupClassName],
          {
            [styles.isStreamerCard]: !!streamerCardImageUrl,
          },
        )}
      >
        <Image
          alt=""
          className={styles.gameCardBgArtImage}
          draggable={false}
          fit="cover"
          loadingType="none"
          sizes={`
            (max-width: ${CommonUtils.getRem(600)}) 50vw,
            (max-width: ${CommonUtils.getRem(792)}) 40vw,
            (max-width: ${CommonUtils.getRem(1200)}) 25vw,
            (max-width: ${CommonUtils.getRem(1700)}) 15vw,
            7vw
          `}
          src={streamerCardImageUrl ?? bgImageUrl}
        />
        {isHovering && (
          <div className={styles.bgArtHoverEffect}>
            <div
              className={styles.sparkleEffect}
              style={
                {
                  '--level-group-5-sparkle-effect-url': `url(${levelGroup5SparkleEffectUrl})`,
                  '--level-group-6-sparkle-effect-url': `url(${levelGroup6SparkleEffectUrl})`,
                } as CSSProperties
              }
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

GameCardBackgroundArt.fragments = {
  streamerCard: gql`
    fragment GameCardBackgroundArtStreamerCard on GameLogicStreamerCard {
      id
      image
    }
  `,
  card: gql`
    fragment GameCardBackgroundArtCard on GameLogicCard {
      leveling {
        currentLevel
      }
      rarity
      seasonId
    }
  `,
};
