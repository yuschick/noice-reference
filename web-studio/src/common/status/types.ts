export enum Status {
  Disabled = 'disabled',
  Offline = 'offline',
  Loading = 'loading',
  Paused = 'paused',
  Active = 'active',
  Error = 'error',
  Live = 'live',
}

export interface StatusTextModel {
  status: Status;
  text: string;
}
