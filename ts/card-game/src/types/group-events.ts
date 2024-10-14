import { ActivatedBooster, BoosterType } from './booster';

export enum GroupEventContentType {
  CardSuccess,
  CardFailure,
  CardScavenge,
  BoosterScored,
  AonDoubleDown,
}

interface AonDoubleDownEventContent {
  cardOwnerId: string;
  cardId: string;
  currentTry: number;
  maxTries: number;
}

interface CardFailureEventContent {
  cardOwnerId: string;
  cardId: string;
  activatedBoosters: ActivatedBooster[];
}

interface CardScavengeEventContent {
  cardOwnerId: string;
  cardOwnerPoints: number;
  wasSwitchedOut: boolean;
  cardId: string;
  activatedBoosters: ActivatedBooster[];
}

interface BoosterScoredEventContent {
  boosterOwnerId: string;
  points: number;
  cardId?: string;
  booster: BoosterType;
}

interface CardSuccessEventContent {
  cardOwnerId: string;
  cardId: string;
  points: number;
  isBestPlay: boolean;
  activatedBoosters: ActivatedBooster[];
}

export interface GroupEventContentTypeMap {
  [GroupEventContentType.CardSuccess]: CardSuccessEventContent;
  [GroupEventContentType.CardFailure]: CardFailureEventContent;
  [GroupEventContentType.CardScavenge]: CardScavengeEventContent;
  [GroupEventContentType.BoosterScored]: BoosterScoredEventContent;
  [GroupEventContentType.AonDoubleDown]: AonDoubleDownEventContent;
}

interface GroupEventMessageType<K extends keyof GroupEventContentTypeMap> {
  id: string;
  contentType: K;
  content: GroupEventContentTypeMap[K];
}

export type GroupEventMessage =
  | GroupEventMessageType<GroupEventContentType.CardSuccess>
  | GroupEventMessageType<GroupEventContentType.CardScavenge>
  | GroupEventMessageType<GroupEventContentType.CardFailure>
  | GroupEventMessageType<GroupEventContentType.BoosterScored>
  | GroupEventMessageType<GroupEventContentType.AonDoubleDown>;
