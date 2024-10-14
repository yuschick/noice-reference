export declare enum LiveStatus {
    LIVE_STATUS_UNSPECIFIED = "LIVE_STATUS_UNSPECIFIED",
    LIVE_STATUS_OFFLINE = "LIVE_STATUS_OFFLINE",
    LIVE_STATUS_UNLISTED = "LIVE_STATUS_UNLISTED",
    LIVE_STATUS_LIVE = "LIVE_STATUS_LIVE"
}
export type StreamSegment = {
    segmentId?: string;
    startTime?: string;
    endTime?: string;
    title?: string;
    gameId?: string;
    crConfig?: ContentRendererConfig;
    mlConfig?: MachineLearningConfig;
};
export type Stream = {
    channelId?: string;
    streamId?: string;
    segments?: StreamSegment[];
    noicePredictionsEnabled?: boolean;
    matureRatedContent?: boolean;
};
export type ContentRendererConfig = {
    arenaId?: string;
    containerImage?: string;
    controllerContainerImage?: string;
};
export type MachineLearningConfig = {
    containerImage?: string;
};
export type StreamRecorderConfig = {
    containerImage?: string;
};
//# sourceMappingURL=common.pb.d.ts.map