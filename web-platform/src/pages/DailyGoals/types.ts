export enum DailyGoalState {
  Default,
  Select,
  SwitchOut,
}

export type CurrentState =
  | { state: DailyGoalState.Default }
  | {
      state: DailyGoalState.Select;
      slotId: string;
    }
  | {
      state: DailyGoalState.SwitchOut;
      slotId: string;
      cardId: string;
    };
