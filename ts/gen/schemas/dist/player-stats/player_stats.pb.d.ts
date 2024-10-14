import * as fm from "../fetch.pb";
export type PlayerStatsBoosterUsage = {
    total?: string;
    speedUp?: string;
    scavenge?: string;
    goodCall?: string;
    letsGo?: string;
    doubt?: string;
    nextUp?: string;
};
export type PlayerStatsCurrencySpending = {
    softCurrency?: string;
    hardCurrency?: string;
    channelCurrency?: string;
};
export type PlayerStats = {
    matchesPlayed?: string;
    timePlayed?: string;
    dailyGoalCardsCompleted?: string;
    cardsPlayed?: string;
    shufflesUsed?: string;
    cardBundlesPurchased?: string;
    cardsSucceeded?: string;
    boosterUsage?: PlayerStatsBoosterUsage;
    adsWatched?: string;
    currencySpending?: PlayerStatsCurrencySpending;
    dailyGoalCardsSet?: string;
    cardLevelUps?: string;
    soloMatchesPlayed?: string;
    partyMatchesPlayed?: string;
};
export type GetPlayerStatsRequest = {
    userId?: string;
    seasonId?: string;
};
export type GetPlayerStatsResponse = {
    stats?: PlayerStats;
};
export declare class PlayerStatsService {
    static GetPlayerStats(req: GetPlayerStatsRequest, initReq?: fm.InitReq): Promise<GetPlayerStatsResponse>;
}
//# sourceMappingURL=player_stats.pb.d.ts.map