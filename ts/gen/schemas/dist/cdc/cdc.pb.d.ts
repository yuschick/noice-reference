export type ChangeDataCaptureEvent = {
    cluster?: string;
    database?: string;
    table?: string;
    key?: Uint8Array;
    after?: Uint8Array;
    updated?: string;
    before?: Uint8Array;
};
//# sourceMappingURL=cdc.pb.d.ts.map