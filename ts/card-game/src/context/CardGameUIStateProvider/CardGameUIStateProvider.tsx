import { useToggle, WithChildren } from '@noice-com/common-ui';
import { AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext as CardSelectOpenedContext } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useEffect } from 'react';

import { useCardGameAPIInternal } from '../CardGameAPIProvider';

import { useCardSelectOpenState, useChallengesDialogOpenState } from './hooks';

/**
 * This is an internal only provider for card-game package for UI state
 * related things that are not part of the game state. And also that these
 * states need to be accessed in different parts of the card-game components
 * (so passing down props is not nice)
 */
interface CardGameUIState {
  isChallengesDialogOpen: boolean;
  isCardSelectOpen: boolean;
  openCardSelect(context: CardSelectOpenedContext): void;
  closeCardSelect(): void;
  openChallengesDialog(): void;
  closeChallengesDialog(): void;
}

const CardGameUIStateContext = createContext<Nullable<CardGameUIState>>(null);

interface Props {
  hideContent?: boolean;
  showWaitingForMatch: boolean;
}

export function CardGameUIStateProvider({
  hideContent,
  showWaitingForMatch,
  children,
}: WithChildren<Props>) {
  const { emitAPIEvent } = useCardGameAPIInternal();

  const { isCardSelectOpen, openCardSelect, closeCardSelect } = useCardSelectOpenState({
    hideContent,
  });
  const { isChallengesDialogOpen, openChallengesDialog, closeChallengesDialog } =
    useChallengesDialogOpenState({ hideContent, showWaitingForMatch });

  useEffect(() => {
    if (!hideContent) {
      return;
    }

    // @todo: need to figure out a right place for this since the apply booster state is not here
    emitAPIEvent('onToggleApplyingBooster', false);
  }, [hideContent, emitAPIEvent]);

  return (
    <CardGameUIStateContext.Provider
      value={{
        isCardSelectOpen,
        isChallengesDialogOpen,
        openCardSelect,
        closeCardSelect,
        openChallengesDialog,
        closeChallengesDialog,
      }}
    >
      {children}
    </CardGameUIStateContext.Provider>
  );
}

export interface MockProps {
  isCardSelectOpenDefault?: boolean;
  isChallengesDialogOpenDefault?: boolean;
}

export function MockCardGameUIGameStateProvider({
  children,
  isCardSelectOpenDefault = false,
  isChallengesDialogOpenDefault = false,
}: WithChildren<MockProps>) {
  const [isCardSelectOpen, , openCardSelect, closeCardSelect] = useToggle(
    isCardSelectOpenDefault,
  );
  const [isChallengesDialogOpen, , openChallengesDialog, closeChallengesDialog] =
    useToggle(isChallengesDialogOpenDefault);

  return (
    <CardGameUIStateContext.Provider
      value={{
        isCardSelectOpen,
        isChallengesDialogOpen,
        openCardSelect,
        closeCardSelect,
        openChallengesDialog,
        closeChallengesDialog,
      }}
    >
      {children}
    </CardGameUIStateContext.Provider>
  );
}

export function useCardGameUIState() {
  const context = useContext(CardGameUIStateContext);

  if (!context) {
    throw new Error(
      'Trying to access CardGameUIStateContext from context without CardGameUIStateProvider',
    );
  }

  return context;
}
