import * as AdsAds from "../ads/ads.pb";
import * as Game_cardGame_card from "../game-card/game_card.pb";
import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as GameGame from "../game/game.pb";
import * as Goal_cardGoal_card from "../goal-card/goal_card.pb";
import * as ItemItem from "../item/item.pb";
import * as ProgressionProgression from "../progression/progression.pb";
import * as RarityRarity from "../rarity/rarity.pb";
import * as StatStat from "../stat/stat.pb";
export declare enum MetagameConfigCardBundleConfigType {
    TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
    TYPE_STANDARD = "TYPE_STANDARD",
    TYPE_PREMIUM = "TYPE_PREMIUM"
}
export type MetagameConfigPrice = {
    currencyId?: string;
    currencyAmount?: string;
};
export type MetagameConfigMatchReward = {
    coinRatio?: number;
    channelCurrencyRatio?: number;
    teamPlayerBonusRatio?: number;
    maxCoins?: string;
    xpRatio?: number;
    coinsCurrencyId?: string;
    participationCoins?: number;
    participationXp?: number;
    xpBoostMultiplier?: number;
    xpBoostAmount?: number;
    participationCapMin?: number;
    xpEarningsCapMin?: number;
};
export type MetagameConfigCardBundleConfig = {
    id?: string;
    type?: MetagameConfigCardBundleConfigType;
    name?: string;
    currencyId?: string;
    currencyAmount?: string;
    totalCardValue?: string;
    minUniqueCards?: string;
    raritiesRequired?: RarityRarity.Rarity[];
    raritiesAvailable?: RarityRarity.Rarity[];
    chanceOfStreamerCard?: number;
};
export type MetagameConfigCardValueConfig = {
    cardRarity?: RarityRarity.Rarity;
    cardValue?: string;
    cardWeight?: string;
    streamerCardValue?: string;
    streamerCardDuplicateMultiplier?: number;
};
export type MetagameConfigGoalCardsConfig = {
    reshufflePrice?: MetagameConfigPrice;
    epicWeightBoost?: string;
    legendaryWeightBoost?: string;
};
export type MetagameConfigGoalCardValueConfig = {
    cardRarity?: RarityRarity.Rarity;
    cardWeight?: string;
};
export type MetagameConfigUiTimings = {
    teamActionTimeout?: string;
};
export type MetagameConfigMatchMakingConfig = {
    forceNewTeamThreshold?: string;
};
export type MetagameConfigStreamerCardConfig = {
    streamerCardMultiplier?: number;
};
export type MetagameConfigInactivityTimeouts = {
    enabled?: boolean;
    idleTimeoutSec?: number;
    offlineTimeoutSec?: number;
    implicitOfflineTimeoutSec?: number;
};
export type MetagameConfig = {
    counters?: StatStat.CounterConfig[];
    goalCards?: Goal_cardGoal_card.GoalCard[];
    items?: ItemItem.Item[];
    levels?: ProgressionProgression.LevelConfig[];
    userDefaults?: ItemItem.UserDefaults;
    matchReward?: MetagameConfigMatchReward;
    cardBundleConfigs?: MetagameConfigCardBundleConfig[];
    storeCardValueConfigs?: MetagameConfigCardValueConfig[];
    goalCardsConfig?: MetagameConfigGoalCardsConfig;
    goalCardValueConfigs?: MetagameConfigGoalCardValueConfig[];
    gameCards?: Game_logicGame_logic.Card[];
    boosters?: Game_logicGame_logic.Booster[];
    advertisingOdds?: AdsAds.RewardOddsConfig[];
    advertisingLootPools?: AdsAds.LootPoolConfig[];
    streamerCards?: Game_logicGame_logic.StreamerCard[];
    highScoringCard?: Game_cardGame_card.HighScoringCardConfig[];
    highScoringCardTimings?: Game_cardGame_card.HighScoringCardTimings[];
    uiTimings?: MetagameConfigUiTimings;
    matchmaking?: MetagameConfigMatchMakingConfig;
    matchConfigurations?: Game_logicGame_logic.MatchConfiguration[];
    streamerCardConfig?: MetagameConfigStreamerCardConfig;
    inactivityTimeouts?: MetagameConfigInactivityTimeouts;
    cardDuplicateRequirements?: Game_cardGame_card.DuplicateRequirements;
    cardUpgrades?: Game_cardGame_card.LevelMultipliers[];
    advertisingPlacementConfig?: AdsAds.PlacementConfig;
    seasons?: GameGame.Season[];
};
//# sourceMappingURL=metagame.pb.d.ts.map