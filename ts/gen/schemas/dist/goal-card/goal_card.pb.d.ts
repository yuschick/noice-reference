import * as fm from "../fetch.pb";
import * as RarityRarity from "../rarity/rarity.pb";
import * as RewardReward from "../reward/reward.pb";
export declare enum GoalCardTargetType {
    TARGET_TYPE_UNSPECIFIED = "TARGET_TYPE_UNSPECIFIED",
    TARGET_TYPE_TOTAL = "TARGET_TYPE_TOTAL",
    TARGET_TYPE_SINGLE_UPDATE = "TARGET_TYPE_SINGLE_UPDATE",
    TARGET_TYPE_UPDATE_COUNT = "TARGET_TYPE_UPDATE_COUNT"
}
export type GoalCard = {
    id?: string;
    description?: string;
    counterConfigIds?: string[];
    target?: number;
    targetType?: GoalCardTargetType;
    reward?: RewardReward.RewardType;
    gameId?: string;
    cardGoalGroup?: string;
    rarity?: RarityRarity.Rarity;
    requiredItemIds?: string[];
    requiresTeam?: boolean;
    disabled?: boolean;
};
export type GoalCardSetEvent = {
    userId?: string;
    goalCardSlotId?: string;
    goalCardId?: string;
};
export type GoalCardProgressEvent = {
    userId?: string;
    goalCardSlot?: GoalCardSlot;
};
export type GoalCardsDealtEvent = {
    userId?: string;
    slotId?: string;
    cardIds?: string[];
    reshuffle?: boolean;
};
export type GoalCardSlotProgress = {
    value?: number;
    percentage?: number;
    completed?: boolean;
};
export type GoalCardSlot = {
    id?: string;
    goalCardId?: string;
    progress?: GoalCardSlotProgress;
    resetTime?: string;
    cardOptions?: string[];
};
export type ListGoalCardSlotsRequest = {};
export type ListGoalCardSlotsResponse = {
    slots?: GoalCardSlot[];
};
export type SetGoalCardSlotRequest = {
    goalCardSlotId?: string;
    goalCardId?: string;
};
export type SetGoalCardSlotResponse = {};
export type GetSlotOptionsRequest = {
    slotId?: string;
};
export type GetSlotOptionsResponse = {
    cardOptions?: GoalCard[];
};
export type ReshuffleSlotRequest = {
    slotId?: string;
};
export type ReshuffleSlotResponse = {
    cardOptions?: GoalCard[];
};
export type GetGoalCardRequest = {
    id?: string;
};
export type BatchGetGoalCardsRequest = {
    ids?: string[];
};
export type BatchGetGoalCardsResponse = {
    goalCards?: GoalCard[];
};
export type ListAllGoalCardsRequest = {};
export type ListAllGoalCardsResponse = {
    goalCards?: GoalCard[];
};
export declare class GoalCardService {
    static GetGoalCard(req: GetGoalCardRequest, initReq?: fm.InitReq): Promise<GoalCard>;
    static BatchGetGoalCards(req: BatchGetGoalCardsRequest, initReq?: fm.InitReq): Promise<BatchGetGoalCardsResponse>;
    static ListGoalCardSlots(req: ListGoalCardSlotsRequest, initReq?: fm.InitReq): Promise<ListGoalCardSlotsResponse>;
    static SetGoalCardSlot(req: SetGoalCardSlotRequest, initReq?: fm.InitReq): Promise<SetGoalCardSlotResponse>;
    static GetSlotOptions(req: GetSlotOptionsRequest, initReq?: fm.InitReq): Promise<GetSlotOptionsResponse>;
    static ReshuffleSlot(req: ReshuffleSlotRequest, initReq?: fm.InitReq): Promise<ReshuffleSlotResponse>;
}
export declare class GoalCardAdminService {
    static ListAllGoalCards(req: ListAllGoalCardsRequest, initReq?: fm.InitReq): Promise<ListAllGoalCardsResponse>;
}
//# sourceMappingURL=goal_card.pb.d.ts.map