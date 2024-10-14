import * as fm from "../fetch.pb";
export type PingRequest = {
    message?: string;
};
export type PingResponse = {
    message?: string;
};
export declare class PingService {
    static Ping(req: PingRequest, initReq?: fm.InitReq): Promise<PingResponse>;
}
//# sourceMappingURL=ping.pb.d.ts.map