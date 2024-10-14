import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export type KillStreamRequest = {
    streamId?: string;
};
export declare class StreamIngestControllerService {
    static KillStream(req: KillStreamRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
//# sourceMappingURL=stream_ingest_controller.pb.d.ts.map