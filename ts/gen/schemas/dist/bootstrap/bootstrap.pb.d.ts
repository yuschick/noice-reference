import * as fm from "../fetch.pb";
export type BootstrapUserRequest = {
    userId?: string;
    gameId?: string;
    channelId?: string;
    seasonId?: string;
};
export type BootstrapUserResponse = {
    new?: boolean;
};
export declare class BootstrapService {
    static BootstrapUser(req: BootstrapUserRequest, initReq?: fm.InitReq): Promise<BootstrapUserResponse>;
}
//# sourceMappingURL=bootstrap.pb.d.ts.map