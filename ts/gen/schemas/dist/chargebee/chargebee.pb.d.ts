import * as fm from "../fetch.pb";
import * as GoogleApiHttpbody from "../google/api/httpbody.pb";
import * as GoogleProtobufStruct from "../google/protobuf/struct.pb";
export type Event = {
    id?: string;
    occurredAt?: string;
    source?: string;
    user?: string;
    webhookStatus?: string;
    webhookFailureReason?: string;
    eventType?: string;
    apiVersion?: string;
    content?: {
        [key: string]: GoogleProtobufStruct.Value;
    };
};
export declare class ChargebeeProxyService {
    static CreateEvent(req: Event, initReq?: fm.InitReq): Promise<GoogleApiHttpbody.HttpBody>;
}
//# sourceMappingURL=chargebee.pb.d.ts.map