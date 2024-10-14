import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export type Dota2GSIEventProvider = {
    name?: string;
    appid?: number;
    version?: number;
    timestamp?: number;
};
export type Dota2GSIEventPlayer = {
    steamid?: string;
    name?: string;
    activity?: string;
    kills?: number;
    deaths?: number;
    assists?: number;
    lastHits?: number;
    denies?: number;
    killStreak?: number;
    commandsIssued?: number;
    killList?: {
        [key: string]: number;
    };
    teamName?: string;
    gold?: number;
    goldReliable?: number;
    goldUnreliable?: number;
    goldFromHeroKills?: number;
    goldFromCreepKills?: number;
    goldFromIncome?: number;
    goldFromShared?: number;
    gpm?: number;
    xpm?: number;
};
export type Dota2GSIEventAuth = {
    token?: string;
};
export type Dota2GSIEventHealthInfo = {
    health?: number;
    maxHealth?: number;
};
export type Dota2GSIEventRadiant = {
    dotaGoodguysTower1Top?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower2Top?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower3Top?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower1Mid?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower2Mid?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower3Mid?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower1Bot?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower2Bot?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower3Bot?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower4Top?: Dota2GSIEventHealthInfo;
    dotaGoodguysTower4Bot?: Dota2GSIEventHealthInfo;
    goodRaxMeleeTop?: Dota2GSIEventHealthInfo;
    goodRaxRangeTop?: Dota2GSIEventHealthInfo;
    goodRaxMeleeMid?: Dota2GSIEventHealthInfo;
    goodRaxRangeMid?: Dota2GSIEventHealthInfo;
    goodRaxMeleeBot?: Dota2GSIEventHealthInfo;
    goodRaxRangeBot?: Dota2GSIEventHealthInfo;
    dotaGoodguysFort?: Dota2GSIEventHealthInfo;
};
export type Dota2GSIEventDire = {
    dotaBadguysTower1Top?: Dota2GSIEventHealthInfo;
    dotaBadguysTower2Top?: Dota2GSIEventHealthInfo;
    dotaBadguysTower3Top?: Dota2GSIEventHealthInfo;
    dotaBadguysTower1Mid?: Dota2GSIEventHealthInfo;
    dotaBadguysTower2Mid?: Dota2GSIEventHealthInfo;
    dotaBadguysTower3Mid?: Dota2GSIEventHealthInfo;
    dotaBadguysTower1Bot?: Dota2GSIEventHealthInfo;
    dotaBadguysTower2Bot?: Dota2GSIEventHealthInfo;
    dotaBadguysTower3Bot?: Dota2GSIEventHealthInfo;
    dotaBadguysTower4Top?: Dota2GSIEventHealthInfo;
    dotaBadguysTower4Bot?: Dota2GSIEventHealthInfo;
    badRaxMeleeTop?: Dota2GSIEventHealthInfo;
    badRaxRangeTop?: Dota2GSIEventHealthInfo;
    badRaxMeleeMid?: Dota2GSIEventHealthInfo;
    badRaxRangeMid?: Dota2GSIEventHealthInfo;
    badRaxMeleeBot?: Dota2GSIEventHealthInfo;
    badRaxRangeBot?: Dota2GSIEventHealthInfo;
    dotaBadguysFort?: Dota2GSIEventHealthInfo;
};
export type Dota2GSIEventBuildings = {
    radiant?: Dota2GSIEventRadiant;
    dire?: Dota2GSIEventDire;
};
export type Dota2GSIEventMap = {
    name?: string;
    matchid?: string;
    gameTime?: number;
    clockTime?: number;
    daytime?: boolean;
    nightstalkerNight?: boolean;
    gameState?: string;
    paused?: boolean;
    winTeam?: string;
    customgamename?: string;
    wardPurchaseCooldown?: number;
};
export type Dota2GSIEventHero = {
    id?: number;
    name?: string;
    xpos?: number;
    ypos?: number;
    level?: number;
    xp?: number;
    alive?: boolean;
    respawnSeconds?: number;
    buybackCost?: number;
    buybackCooldown?: number;
    health?: number;
    maxHealth?: number;
    healthPercent?: number;
    mana?: number;
    maxMana?: number;
    manaPercent?: number;
    silenced?: boolean;
    stunned?: boolean;
    disarmed?: boolean;
    magicimmune?: boolean;
    hexed?: boolean;
    muted?: boolean;
    break?: boolean;
    aghanimsScepter?: boolean;
    aghanimsShard?: boolean;
    smoked?: boolean;
    hasDebuff?: boolean;
    talent1?: boolean;
    talent2?: boolean;
    talent3?: boolean;
    talent4?: boolean;
    talent5?: boolean;
    talent6?: boolean;
    talent7?: boolean;
    talent8?: boolean;
};
export type Dota2GSIEventAbility = {
    name?: string;
    level?: number;
    canCast?: boolean;
    passive?: boolean;
    abilityActive?: boolean;
    cooldown?: number;
    ultimate?: boolean;
    charges?: number;
    maxCharges?: number;
    chargeCooldown?: number;
};
export type Dota2GSIEventItem = {
    name?: string;
    purchaser?: number;
    canCast?: boolean;
    cooldown?: number;
    passive?: boolean;
    charges?: number;
};
export type Dota2GSIEventTeam = {
    homeTeam?: boolean;
    pick0Id?: number;
    pick0Class?: string;
    pick1Id?: number;
    pick1Class?: string;
    pick2Id?: number;
    pick2Class?: string;
    pick3Id?: number;
    pick3Class?: string;
    pick4Id?: number;
    pick4Class?: string;
    ban0Id?: number;
    ban0Class?: string;
    ban1Id?: number;
    ban1Class?: string;
    ban2Id?: number;
    ban2Class?: string;
    ban3Id?: number;
    ban3Class?: string;
    ban4Id?: number;
    ban4Class?: string;
    ban5Id?: number;
    ban5Class?: string;
    ban6Id?: number;
    ban6Class?: string;
};
export type Dota2GSIEventDraft = {
    activeteam?: number;
    pick?: boolean;
    activeteamTimeRemaining?: number;
    radiantBonusTime?: number;
    direBonusTime?: number;
    team2?: Dota2GSIEventTeam;
    team3?: Dota2GSIEventTeam;
};
export type Dota2GSIEvent = {
    provider?: Dota2GSIEventProvider;
    player?: Dota2GSIEventPlayer;
    draft?: Dota2GSIEventDraft;
    auth?: Dota2GSIEventAuth;
    buildings?: Dota2GSIEventBuildings;
    map?: Dota2GSIEventMap;
    hero?: Dota2GSIEventHero;
    abilities?: {
        [key: string]: Dota2GSIEventAbility;
    };
    items?: {
        [key: string]: Dota2GSIEventItem;
    };
};
export type StreamEventsRequest = {
    channelId?: string;
};
export declare class GSIService {
    static SendDota2Event(req: Dota2GSIEvent, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static StreamDota2Events(req: StreamEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<Dota2GSIEvent>, initReq?: fm.InitReq): Promise<void>;
}
//# sourceMappingURL=gsi.pb.d.ts.map