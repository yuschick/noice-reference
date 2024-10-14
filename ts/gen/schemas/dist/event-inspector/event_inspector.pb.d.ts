import * as fm from "../fetch.pb";
import * as Queue_eventQueue_event from "../queue-event/queue_event.pb";
export type SteamEventsRequest = {
    eventFilter?: {
        [key: string]: string;
    };
    topicTemplates?: string[];
};
export type Event = {
    subject?: string;
    subjectTemplate?: string;
    envelope?: Queue_eventQueue_event.QueueEventEnvelope;
};
export declare class EventInspectorService {
    static StreamEvents(req: SteamEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<Event>, initReq?: fm.InitReq): Promise<void>;
}
//# sourceMappingURL=event_inspector.pb.d.ts.map