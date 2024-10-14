/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "../fetch.pb"
import * as Queue_eventQueue_event from "../queue-event/queue_event.pb"
export type SteamEventsRequest = {
  eventFilter?: {[key: string]: string}
  topicTemplates?: string[]
}

export type Event = {
  subject?: string
  subjectTemplate?: string
  envelope?: Queue_eventQueue_event.QueueEventEnvelope
}

export class EventInspectorService {
  static StreamEvents(req: SteamEventsRequest, entityNotifier?: fm.NotifyStreamEntityArrival<Event>, initReq?: fm.InitReq): Promise<void> {
    if (initReq?.forceWebSocket) {
      return fm.webSocketStreamingRequest<SteamEventsRequest, Event>(`/v1/events/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, {...initReq, method: "GET"})
    }
    if (req.eventFilter) {
        req = {...req, ...fm.flattenMap(req.eventFilter, "eventFilter")} as SteamEventsRequest;
        delete req.eventFilter;
    }
    return fm.fetchStreamingRequest<SteamEventsRequest, Event>(`/v1/events/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, {...initReq, method: "GET"})
  }
}