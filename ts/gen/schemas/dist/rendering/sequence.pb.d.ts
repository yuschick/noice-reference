import * as RenderingTransitions from "./transitions.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
type BaseSequenceStep = {
    time?: string;
    fired?: boolean;
};
export type SequenceStep = BaseSequenceStep & OneOf<{
    contentMode: RenderingTransitions.ContentMode;
    transition: RenderingTransitions.Transition;
}>;
export type Sequence = {
    steps?: SequenceStep[];
    updateServerTime?: string;
};
export interface ISequenceStepKindDelegate<C> {
    onContentMode(ctx: C, ev: RenderingTransitions.ContentMode): void;
    onTransition(ctx: C, ev: RenderingTransitions.Transition): void;
}
export declare function routeSequenceStepKindDelegate<C>(ctx: C, val: SequenceStep, delegate: ISequenceStepKindDelegate<C>): void;
export {};
//# sourceMappingURL=sequence.pb.d.ts.map