import * as fm from "../fetch.pb";
export type EnsureEgressProxyRequest = {
    streamId?: string;
    streamType?: string;
    channelId?: string;
};
export type EnsureEgressProxyResponseTrack = {
    id?: string;
};
export type EnsureEgressProxyResponse = {
    tracks?: EnsureEgressProxyResponseTrack[];
};
export declare class EgressProxyService {
    static EnsureEgressProxy(req: EnsureEgressProxyRequest, initReq?: fm.InitReq): Promise<EnsureEgressProxyResponse>;
}
//# sourceMappingURL=egress_proxy.pb.d.ts.map