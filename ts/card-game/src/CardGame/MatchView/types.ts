import { ReactNode } from 'react';

export enum MatchViewAnimationState {
  Appear,
  Leave,
  None,
}

export interface MatchViewBaseProps {
  cardsHidden?: boolean;
  isSpectator?: boolean;
  highScoringCardsClassName?: string;
}

export interface MatchViewSmProps extends MatchViewBaseProps {
  slots?: {
    cardContainerSmAction: ReactNode;
  };
}

export type MatchViewProps = MatchViewBaseProps & MatchViewSmProps;
