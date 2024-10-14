import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { CurrentState, DailyGoalState } from '../types';

interface Context {
  currentState: CurrentState;
  setCurrentStateToDefault: () => void;
  setCurrentStateToSelect: (slotId: string) => void;
  setCurrentStateToSwitchOut: (slotId: string, cardId: string) => void;
}

const DailyGoalStateContext = createContext<Nullable<Context>>(null);

interface Props {
  currentState: CurrentState;
  setCurrentState: React.Dispatch<React.SetStateAction<CurrentState>>;
}

export const DailyGoalStateProvider = ({
  children,
  currentState,
  setCurrentState,
}: WithChildren<Props>) => {
  const setCurrentStateToDefault = () => {
    setCurrentState({ state: DailyGoalState.Default });
  };

  const setCurrentStateToSelect = (slotId: string) => {
    setCurrentState({ state: DailyGoalState.Select, slotId });
  };

  const setCurrentStateToSwitchOut = (slotId: string, cardId: string) => {
    setCurrentState({ state: DailyGoalState.SwitchOut, slotId, cardId });
  };

  return (
    <DailyGoalStateContext.Provider
      value={{
        currentState,
        setCurrentStateToDefault,
        setCurrentStateToSelect,
        setCurrentStateToSwitchOut,
      }}
    >
      {children}
    </DailyGoalStateContext.Provider>
  );
};

export const useDailyGoalState = () => {
  const context = useContext(DailyGoalStateContext);

  if (!context) {
    throw new Error(
      'Trying to use useDailyGoalState without having DailyGoalStateProvider',
    );
  }

  return context;
};
