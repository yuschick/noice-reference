import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
export declare enum EntityType {
    ENTITY_TYPE_UNSPECIFIED = "ENTITY_TYPE_UNSPECIFIED",
    ENTITY_TYPE_USER = "ENTITY_TYPE_USER",
    ENTITY_TYPE_CHANNEL = "ENTITY_TYPE_CHANNEL"
}
export type SearchRequest = {
    query?: string;
    entityTypes?: EntityType[];
    cursor?: ApiCursor.Cursor;
};
export type ResultItem = {
    entityType?: EntityType;
    entityId?: string;
    score?: number;
    matchedProperties?: string[];
};
export type SearchResponse = {
    resultItems?: ResultItem[];
    pageInfo?: ApiCursor.PageInfo;
};
export declare class SearchService {
    static Search(req: SearchRequest, initReq?: fm.InitReq): Promise<SearchResponse>;
}
//# sourceMappingURL=search.pb.d.ts.map