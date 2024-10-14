export interface CGAvailableBoosterOnBoosterUsed {
  targetId: string;
  targetIsSelf: boolean;
}

export interface CGAvailableBoosterOnBoosterRequested {
  requesteeId: string;
}

export interface CGAvailableBoosterOnRequestCancelled {
  requesteeId: string;
}
