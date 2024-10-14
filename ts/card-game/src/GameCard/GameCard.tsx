import { gql } from '@apollo/client';
import { IconButton, useToggle } from '@noice-com/common-ui';
import classNames from 'classnames';
import {
  CSSProperties,
  HTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  useRef,
} from 'react';
import { HiOutlineArrowsExpand } from 'react-icons/hi';

import styles from './GameCard.module.css';
import { GameCardSupportedElements, GameCardProps } from './GameCard.types';
import { GameCardBackgroundArt } from './GameCardBackgroundArt';
import { GameCardBackgroundVideo } from './GameCardBackgroundVideo';
import { GameCardBottomLabel } from './GameCardBottomLabel';
import { GameCardDisabled } from './GameCardDisabled';
import { GameCardFrame } from './GameCardFrame';
import { GameCardHero } from './GameCardHero';
import { GameCardInfo } from './GameCardInfo';
import { GameCardLevel } from './GameCardLevel';
import { GameCardPoints } from './GameCardPoints';
import { GameCardStreamerDialog } from './GameCardStreamerDialog';
import { GameCardTypeBadge } from './GameCardTypeBadge';
import { useStreamerCardVideo } from './hooks';

import {
  useCardTransforms,
  useIsMouseLeavingCard,
  useMousePositionOnCard,
} from '@game-common/card/hooks';
import { MOUSE_IS_LEAVING_TRANSFORM_TRANSITION, SIZE_TRANSITION } from '@game-constants';

export function GameCard<T extends GameCardSupportedElements>({
  as,
  card,
  slots,
  isDisabled,
  streamerVideoPlayMode = 'hover',
  streamerVideoAction = 'expand',
  playVideoInline,
  ...htmlAttributes
}: GameCardProps<T>) {
  const { onClick } = htmlAttributes;
  const streamerCard = card.activeStreamerCard ?? null;
  const isStreamerCard = !!streamerCard;

  const playingCardRef = useRef<HTMLDivElement>(null);

  const [streamerModalOpen, , onExpandStreamerCardToModal, onCloseStreamerCardModal] =
    useToggle(false);
  const { positionOnCard, isHovering } = useMousePositionOnCard({
    card: playingCardRef,
  });
  const cssTransformVars = useCardTransforms({ positionOnCard });
  const { isMouseLeaving } = useIsMouseLeavingCard({ isHovering });
  const isPlayingVideo = useStreamerCardVideo({
    isHovering,
    isStreamerCard,
  });

  const CardElement = as ?? 'div';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      return;
    }

    onClick?.(event);
  };

  const showStreamerCardVideoPreview =
    streamerCard &&
    !streamerModalOpen &&
    (isPlayingVideo || (isStreamerCard && streamerVideoPlayMode === 'auto'));

  return (
    <div
      className={classNames(styles.gameCardRoot, {
        [styles.isHovering]: isHovering,
        [styles.mouseIsLeaving]: isMouseLeaving,
        [styles.isPlayingVideo]: isPlayingVideo,
        [styles.isStreamerCard]: isStreamerCard,
        [styles.isDisabled]: isDisabled,
      })}
      ref={playingCardRef}
      style={
        {
          ...cssTransformVars,
          '--game-card-size-transition': `${SIZE_TRANSITION}ms`,
          '--game-card-mouse-is-leaving-transition': `${MOUSE_IS_LEAVING_TRANSFORM_TRANSITION}ms`,
        } as CSSProperties
      }
    >
      <CardElement
        aria-label={`Game card ${card.name}`}
        {...(isDisabled && { 'aria-disabled': true })}
        className={styles.gameCardWrapper}
        {...(htmlAttributes as HTMLAttributes<HTMLDivElement | HTMLButtonElement>)}
        onClick={
          as === 'button'
            ? (handleClick as MouseEventHandler<HTMLButtonElement | HTMLDivElement>)
            : undefined
        }
      >
        <GameCardFrame
          card={card}
          className={styles.gameCardMovingWrapper}
          isHovering={isHovering}
          streamerCard={streamerCard}
        >
          {slots?.customFrontLayer && slots.customFrontLayer()}

          <div className={styles.gameCardBigContentContainer}>
            {showStreamerCardVideoPreview ? (
              <GameCardBackgroundVideo
                className={styles.gameCardBgArtAndVideo}
                playVideoInline={playVideoInline}
                streamerCard={streamerCard}
              />
            ) : (
              <GameCardBackgroundArt
                card={card}
                className={styles.gameCardBgArtAndVideo}
                isHovering={isHovering}
                isMouseLeaving={isMouseLeaving}
                streamerCard={streamerCard}
              />
            )}

            <GameCardHero
              card={card}
              className={styles.gameCardHeroArt}
              isHovering={isHovering}
              isMouseLeaving={isMouseLeaving}
            />
            <div className={styles.gameCardInfoContainer}>
              {/* Render info slot given by parent or default info based on data */}
              {slots?.info?.({ card }) ?? <GameCardInfo card={card} />}
            </div>
          </div>

          <GameCardLevel card={card} />

          <div className={styles.gameCardBottomContent}>
            {/* Render points slot given by parent or default info based on data */}
            <div className={styles.gameCardBottomContentPointsContainer}>
              {slots?.points?.({ card, streamerCard }) ?? (
                <GameCardPoints
                  card={card}
                  streamerCard={streamerCard}
                />
              )}
            </div>

            <GameCardTypeBadge
              card={card}
              className={styles.gameCardBottomContentBadge}
              streamerCard={streamerCard}
            />
            <div className={styles.gameCardBottomContentBottomLabelContainer}>
              {slots?.bottomLabel?.({ card, streamerCard }) ?? (
                <GameCardBottomLabel
                  card={card}
                  streamerCard={streamerCard}
                />
              )}
            </div>
          </div>
        </GameCardFrame>
      </CardElement>

      {isDisabled && <GameCardDisabled />}

      {showStreamerCardVideoPreview && streamerVideoAction === 'expand' && (
        <div className={styles.gameCardBgVideoExpandButtonWrapper}>
          <IconButton
            icon={HiOutlineArrowsExpand}
            label="Expand video"
            size="sm"
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              onExpandStreamerCardToModal();
            }}
          />
        </div>
      )}
      {isStreamerCard && streamerModalOpen && (
        <GameCardStreamerDialog
          streamerCard={streamerCard}
          onClose={onCloseStreamerCardModal}
        />
      )}
    </div>
  );
}

GameCard.Loading = function GameCardLoading() {
  return (
    <div className={styles.gameCardRoot}>
      <div
        className={classNames(
          styles.gameCardLoadingWrapper,
          styles.gameCardMovingWrapper,
        )}
      >
        <div className={styles.gameCardLoadingArtContainer}>
          <div
            aria-busy="true"
            aria-live="polite"
            className={styles.gameCardLoadingArt}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * We have this as a separate fragment so we can e.g. in store fetch required pieces for the card like this
 * 
 *  details {
 *    ... on GameLogicCard {
        ...GameCard
 *    }
 *    ... on GameLogicStreamerCard {
 *      ...GameStreamerCard
 *      baseCard {
 *        ...GameStreamerBaseCard
 *      }
 *    }
 *  }
 * 
 * If in baseCard we would have used GameCard fragment, 
 * we would have to fetch all the fields GameStreamerCard again in activeStreamerCard for GameCard
 */
const streamerBaseCard = gql`
  fragment GameStreamerBaseCard on GameLogicCard {
    id
    name
    ...GameCardBackgroundArtCard
    ...GameCardBottomLabelCard
    ...GameCardFrameCard
    ...GameCardHeroCard
    ...GameCardInfoCard
    ...GameCardLevelCard
    ...GameCardPointsCard
    ...GameCardTypeBadgeCard
  }

  ${GameCardBackgroundArt.fragments.card}
  ${GameCardBottomLabel.fragments.card}
  ${GameCardFrame.fragments.card}
  ${GameCardHero.fragments.card}
  ${GameCardInfo.fragments.card}
  ${GameCardLevel.fragments.card}
  ${GameCardPoints.fragments.card}
  ${GameCardTypeBadge.fragments.card}
`;

/**
 * This is used in queries when need to specifically ONLY streamer card fields (check description above)
 */
const streamerCard = gql`
  fragment GameStreamerCard on GameLogicStreamerCard {
    id
    ...GameCardBackgroundArtStreamerCard
    ...GameCardBackgroundVideoStreamerCard
    ...GameCardBottomLabelStreamerCard
    ...GameCardFrameStreamerCard
    ...GameCardPointsStreamerCard
    ...GameCardStreamerDialogStreamerCard
    ...GameCardTypeBadgeStreamerCard
  }

  ${GameCardBackgroundArt.fragments.streamerCard}
  ${GameCardBackgroundVideo.fragments.streamerCard}
  ${GameCardBottomLabel.fragments.streamerCard}
  ${GameCardFrame.fragments.streamerCard}
  ${GameCardPoints.fragments.streamerCard}
  ${GameCardStreamerDialog.fragments.streamerCard}
  ${GameCardTypeBadge.fragments.streamerCard}
`;

GameCard.fragments = {
  streamerBaseCard,
  streamerCard,
  /**
   * This fragment is the default and most used one when just quering cards in e.g. listGameCards
   * query and cards might contain streamer skins. This fragment includes resolving the possible
   * streamer card data so no need to add that to the query separately.
   */
  card: gql`
    fragment GameCard on GameLogicCard {
      id
      activeStreamerCard {
        id
        ...GameStreamerCard
      }
      ...GameStreamerBaseCard
    }

    ${streamerBaseCard}
    ${streamerCard}
  `,
};
