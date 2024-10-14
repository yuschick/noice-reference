type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum NullValue {
    NULL_VALUE = "NULL_VALUE"
}
export type Struct = {
    fields?: {
        [key: string]: Value;
    };
};
type BaseValue = {};
export type Value = BaseValue & OneOf<{
    nullValue: NullValue;
    numberValue: number;
    stringValue: string;
    boolValue: boolean;
    structValue: Struct;
    listValue: ListValue;
}>;
export type ListValue = {
    values?: Value[];
};
export interface IValueKindDelegate<C> {
    onNullValue(ctx: C, ev: NullValue): void;
    onNumberValue(ctx: C, ev: number): void;
    onStringValue(ctx: C, ev: string): void;
    onBoolValue(ctx: C, ev: boolean): void;
    onStructValue(ctx: C, ev: Struct): void;
    onListValue(ctx: C, ev: ListValue): void;
}
export declare function routeValueKindDelegate<C>(ctx: C, val: Value, delegate: IValueKindDelegate<C>): void;
export {};
//# sourceMappingURL=struct.pb.d.ts.map