import { SetTimeoutId, useLeavingTransition } from '@noice-com/common-ui';
import { RefObject, TransitionEvent, useLayoutEffect, useRef, useState } from 'react';

import { MATCH_VIEW_TRANSITION_TIME } from '../const';
import { MatchViewAnimationState } from '../types';

import { useCardGameUIState } from '@game-context';

interface HookResult {
  isCardSelectAppearing: boolean;
  isCardSelectLeaving: boolean;
  isCardRowAppearing: boolean;
  isCardRowLeaving: boolean;
  onCardRowTransitionEnd(event: TransitionEvent): void;
  onCardSelectTransitionEnd(event: TransitionEvent): void;
}

interface Props {
  cardsHidden?: boolean;
  cardRowElement: RefObject<HTMLDivElement>;
  cardSelectElement: RefObject<HTMLDivElement>;
}

export function useMatchViewAnimations({
  cardsHidden,
  cardRowElement,
  cardSelectElement,
}: Props): HookResult {
  const initialRenderDone = useRef(false);
  const [cardRowAnimationState, setCardRowAnimationState] = useState(
    MatchViewAnimationState.None,
  );
  const [cardSelectAnimationState, setCardSelectAnimationState] = useState(
    MatchViewAnimationState.None,
  );
  const transformedPropertiesLength = useRef(0);

  const { isCardSelectOpen } = useCardGameUIState();

  // Card select open/close animation
  useLayoutEffect(() => {
    if (cardsHidden) {
      setCardRowAnimationState(MatchViewAnimationState.Appear);
      setCardSelectAnimationState(MatchViewAnimationState.None);
      return;
    }

    // When we are in initial render, we need to take in account the transition time of match view
    const timeoutDuration = !initialRenderDone.current ? MATCH_VIEW_TRANSITION_TIME : 0;

    let timeout: SetTimeoutId;
    if (isCardSelectOpen) {
      timeout = setTimeout(() => {
        initialRenderDone.current = true;
        setCardRowAnimationState((cur) => {
          // If card row is in correct state, start showing card select
          if (cur === MatchViewAnimationState.None) {
            setCardSelectAnimationState(MatchViewAnimationState.Appear);
            return cur;
          }

          // We need to leave card row first
          return MatchViewAnimationState.Leave;
        });
      }, timeoutDuration);
    } else {
      timeout = setTimeout(() => {
        initialRenderDone.current = true;
        setCardSelectAnimationState((cur) => {
          // If card select is in correct state, start showing card row
          if (cur === MatchViewAnimationState.None) {
            setCardRowAnimationState(MatchViewAnimationState.Appear);
            return cur;
          }

          // We need to leave card select first
          return MatchViewAnimationState.Leave;
        });
      }, timeoutDuration);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isCardSelectOpen, cardsHidden]);

  const onCardRowTransitionEnd = (event: TransitionEvent) => {
    // Ignore children
    if (event.target !== cardRowElement.current) {
      transformedPropertiesLength.current = 0;
      return;
    }

    // Check that both properties are transformed
    transformedPropertiesLength.current++;

    if (transformedPropertiesLength.current < 2) {
      return;
    }

    transformedPropertiesLength.current = 0;

    // If finished state was leave, set card select to appear and row to none
    if (cardRowAnimationState === MatchViewAnimationState.Leave) {
      setCardRowAnimationState(MatchViewAnimationState.None);
      setCardSelectAnimationState(MatchViewAnimationState.Appear);
      return;
    }
  };

  const onCardSelectTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== cardSelectElement.current) {
      transformedPropertiesLength.current = 0;
      return;
    }

    // Check that both properties are transformed
    transformedPropertiesLength.current++;

    if (transformedPropertiesLength.current < 2) {
      return;
    }

    transformedPropertiesLength.current = 0;

    // It is possible to end up in a situation where animation state is not matching
    // card select open state. This can happen if user clicks on card select button
    // just the right moment when card success/fail forces card select to close
    const needToForceLeave =
      cardSelectAnimationState === MatchViewAnimationState.Appear && !isCardSelectOpen;

    if (cardSelectAnimationState === MatchViewAnimationState.Leave || needToForceLeave) {
      setCardSelectAnimationState(MatchViewAnimationState.None);
      setCardRowAnimationState(MatchViewAnimationState.Appear);
      return;
    }
  };

  const isCardSelectAppearing =
    cardSelectAnimationState === MatchViewAnimationState.Appear;
  const { isLeaving: isCardSelectLeaving } = useLeavingTransition({
    isShown: cardSelectAnimationState === MatchViewAnimationState.Appear,
    duration: MATCH_VIEW_TRANSITION_TIME,
  });

  const isCardRowAppearing = cardRowAnimationState === MatchViewAnimationState.Appear;
  const { isLeaving: isCardRowLeaving } = useLeavingTransition({
    isShown: cardRowAnimationState === MatchViewAnimationState.Appear,
    duration: MATCH_VIEW_TRANSITION_TIME,
  });

  return {
    isCardSelectAppearing,
    isCardSelectLeaving,
    isCardRowAppearing,
    isCardRowLeaving,
    onCardRowTransitionEnd,
    onCardSelectTransitionEnd,
  };
}
