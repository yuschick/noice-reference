import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
export declare enum DismissalType {
    DISMISSAL_TYPE_UNSPECIFIED = "DISMISSAL_TYPE_UNSPECIFIED",
    DISMISSAL_TYPE_ACTION_TAKEN = "DISMISSAL_TYPE_ACTION_TAKEN",
    DISMISSAL_TYPE_CLOSED = "DISMISSAL_TYPE_CLOSED"
}
export declare enum ConfigItemAlignment {
    ALIGNMENT_UNSPECIFIED = "ALIGNMENT_UNSPECIFIED",
    ALIGNMENT_TOP = "ALIGNMENT_TOP",
    ALIGNMENT_LEFT = "ALIGNMENT_LEFT",
    ALIGNMENT_RIGHT = "ALIGNMENT_RIGHT",
    ALIGNMENT_BOTTOM = "ALIGNMENT_BOTTOM",
    ALIGNMENT_CENTER = "ALIGNMENT_CENTER"
}
export declare enum ConfigItemMessageType {
    MESSAGE_TYPE_UNSPECIFIED = "MESSAGE_TYPE_UNSPECIFIED",
    MESSAGE_TYPE_NOTIFICATION = "MESSAGE_TYPE_NOTIFICATION",
    MESSAGE_TYPE_LINK = "MESSAGE_TYPE_LINK"
}
export type ConfigItem = {
    id?: string;
    title?: string;
    alignment?: ConfigItemAlignment;
    body?: string;
    priority?: number;
    imageContentUrl?: string;
    videoContentUrl?: string;
    criteria?: string;
    delayedShow?: string;
    uiElementAnchor?: string;
    isEnabled?: boolean;
    messageType?: ConfigItemMessageType;
    action?: string;
    link?: string;
    buttonText?: string;
    showVideoAsGif?: boolean;
    hasDismissed?: string;
};
export type Config = {
    items?: ConfigItem[];
};
export type TooltipDismissedEvent = {
    userId?: string;
    tooltipId?: string;
    dismissalType?: DismissalType;
};
export type TooltipDismissResetEvent = {
    userId?: string;
    tooltipId?: string;
};
export type DismissTooltipRequest = {
    tooltipId?: string;
    dismissalType?: DismissalType;
};
export type DeleteDismissedTooltipRequest = {
    tooltipId?: string;
};
export type ListDismissedTooltipsRequest = {};
export type ListDismissedTooltipsResponse = {
    tooltipIds?: string[];
};
export declare class FTUEService {
    static DismissTooltip(req: DismissTooltipRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static DeleteDismissedTooltip(req: DeleteDismissedTooltipRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListDismissedTooltips(req: ListDismissedTooltipsRequest, initReq?: fm.InitReq): Promise<ListDismissedTooltipsResponse>;
}
//# sourceMappingURL=ftue.pb.d.ts.map