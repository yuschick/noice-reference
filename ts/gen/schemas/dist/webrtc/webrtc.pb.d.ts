import * as fm from "../fetch.pb";
export type SetupStreamRelayRequestPeerMeta = {
    peerId?: string;
    sessionId?: string;
};
export type SetupStreamRelayRequest = {
    meta?: SetupStreamRelayRequestPeerMeta;
    data?: Uint8Array;
};
export type SetupStreamRelayResponse = {
    data?: Uint8Array;
};
export declare class RelayService {
    static SetupStreamRelay(req: SetupStreamRelayRequest, initReq?: fm.InitReq): Promise<SetupStreamRelayResponse>;
}
//# sourceMappingURL=webrtc.pb.d.ts.map