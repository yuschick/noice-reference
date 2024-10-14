import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import type { GameCardBottomLabelProps } from './GameCardBottomLabel';
import type { GameCardInfoProps } from './GameCardInfo';
import type { GameCardPointsProps } from './GameCardPoints';

import { GameCardFragment } from '@game-gen';

// We currently support three different types of semantics for the `as` prop: div (default), button, and a.
export interface CardButtonDivAttributes
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onClick'> {
  onClick?: never;
}

export type CardButtonButtonAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'disabled' | 'style'
>;

export interface CardBaseProps {
  /*
   * The card data required to display the card. Check fragments in end of GameCard component to fetch the data.
   */
  card: GameCardFragment;
  /*
   * Render the card in a disabled state.
   */
  isDisabled?: boolean;
  /*
   * Play creator card video on hover or auto play on render (default: 'hover')
   */
  streamerVideoPlayMode?: 'hover' | 'auto';
  /*
   * What action to provide with creator video (default: 'expand').
   *   * 'expand' - Button on top of video to expand video to dialog
   *   * 'none' - No button and no action. Video just plays according to streamerVideoPlayMode prop.
   */
  streamerVideoAction?: 'expand' | 'none';
  /**
   * Forces the video to play inline this can for example be used in embedded native web views
   * where we dont want to open the video in full-screen.
   */
  playVideoInline?: boolean;
  /*
   * Override the default rendering for the card info and points.
   * Slots provide efficient way (performance wise) to update points and info in game. Re-renders only
   * happen for the slot components, and not the entire card.
   *
   * Check out SlotPoints and SlotInfo stories for the card.
   */
  slots?: Partial<{
    customFrontLayer: () => ReactNode;
    info: (card: GameCardInfoProps) => ReactNode;
    points: (card: GameCardPointsProps) => ReactNode;
    bottomLabel: (card: GameCardBottomLabelProps) => ReactNode;
  }>;
}

export type GameCardSupportedElements = 'div' | 'button';

export type GameCardHTMLAttributes<T extends GameCardSupportedElements> =
  T extends 'button' ? CardButtonButtonAttributes : CardButtonDivAttributes;

export type GameCardProps<T extends GameCardSupportedElements = 'div'> = CardBaseProps & {
  /*
   * By default card is a div, but it is possible to define it to be a button when onClick is provided (default 'div').
   * The motivation for the card to handle all of that is that we can make sure we are semantically correct
   * when e.g. rendering the expand button on top of the video for creator card.
   */
  as?: T;
} & GameCardHTMLAttributes<T>;
