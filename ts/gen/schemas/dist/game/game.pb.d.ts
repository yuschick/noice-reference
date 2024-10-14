import * as fm from "../fetch.pb";
import * as RarityRarity from "../rarity/rarity.pb";
export type UserProgression = {
    experiencePoints?: string;
    level?: string;
    userId?: string;
};
export type Game = {
    id?: string;
    name?: string;
    iconUrl?: string;
    backdropUrl?: string;
    activeSeasonId?: string;
    publicAccess?: boolean;
    noicePredictionsEnabled?: boolean;
};
export type SeasonCardBackgroundAsset = {
    rarity?: RarityRarity.Rarity;
    url?: string;
};
export type Season = {
    id?: string;
    gameId?: string;
    name?: string;
    startTime?: string;
    endTime?: string;
    cardBackgroundUrls?: SeasonCardBackgroundAsset[];
    badgeUrl?: string;
    progressionPaused?: boolean;
    progressionPauseReason?: string;
    seasonBreak?: boolean;
    seasonBreakReason?: string;
    seasonPaused?: boolean;
    seasonPauseReason?: string;
};
export type GetGameRequest = {
    id?: string;
};
export type BatchGetGamesRequest = {
    ids?: string[];
};
export type BatchGetGamesResponse = {
    games?: Game[];
};
export type GetSeasonRequest = {
    id?: string;
};
export type BatchGetSeasonsRequest = {
    ids?: string[];
};
export type BatchGetSeasonsResponse = {
    seasons?: Season[];
};
export type ListGamesRequest = {};
export type ListGamesResponse = {
    games?: Game[];
};
export type ListSeasonsRequest = {
    gameId?: string;
};
export type ListSeasonsResponse = {
    seasons?: Season[];
};
export declare class GameService {
    static GetGame(req: GetGameRequest, initReq?: fm.InitReq): Promise<Game>;
    static BatchGetGames(req: BatchGetGamesRequest, initReq?: fm.InitReq): Promise<BatchGetGamesResponse>;
    static ListGames(req: ListGamesRequest, initReq?: fm.InitReq): Promise<ListGamesResponse>;
    static GetSeason(req: GetSeasonRequest, initReq?: fm.InitReq): Promise<Season>;
    static BatchGetSeasons(req: BatchGetSeasonsRequest, initReq?: fm.InitReq): Promise<BatchGetSeasonsResponse>;
    static ListSeasons(req: ListSeasonsRequest, initReq?: fm.InitReq): Promise<ListSeasonsResponse>;
}
//# sourceMappingURL=game.pb.d.ts.map