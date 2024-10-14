import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export type TriggerMatchEndRequest = {
    streamId?: string;
};
export declare class MLControllerService {
    static TriggerMatchEnd(req: TriggerMatchEndRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
}
//# sourceMappingURL=ml_controller.pb.d.ts.map