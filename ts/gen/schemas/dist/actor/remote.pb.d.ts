import * as fm from "../fetch.pb";
import * as GoogleProtobufAny from "../google/protobuf/any.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as ActorCommon from "./common.pb";
export type RequestActorRequest = {
    pid?: ActorCommon.ActorPID;
    message?: GoogleProtobufAny.Any;
};
export type RequestActorResponse = {
    response?: GoogleProtobufAny.Any;
};
export type MessageActorRequest = {
    pid?: ActorCommon.ActorPID;
    message?: GoogleProtobufAny.Any;
};
export declare class ActorService {
    static RequestActor(req: RequestActorRequest, initReq?: fm.InitReq): Promise<RequestActorResponse>;
    static MessageActor(req: MessageActorRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static MessageStream(initReq?: fm.InitReq): Promise<fm.ClientStreamingCall<MessageActorRequest>>;
}
//# sourceMappingURL=remote.pb.d.ts.map