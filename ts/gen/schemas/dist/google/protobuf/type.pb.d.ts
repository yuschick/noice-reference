import * as GoogleProtobufAny from "./any.pb";
import * as GoogleProtobufSource_context from "./source_context.pb";
export declare enum Syntax {
    SYNTAX_PROTO2 = "SYNTAX_PROTO2",
    SYNTAX_PROTO3 = "SYNTAX_PROTO3"
}
export declare enum FieldKind {
    TYPE_UNKNOWN = "TYPE_UNKNOWN",
    TYPE_DOUBLE = "TYPE_DOUBLE",
    TYPE_FLOAT = "TYPE_FLOAT",
    TYPE_INT64 = "TYPE_INT64",
    TYPE_UINT64 = "TYPE_UINT64",
    TYPE_INT32 = "TYPE_INT32",
    TYPE_FIXED64 = "TYPE_FIXED64",
    TYPE_FIXED32 = "TYPE_FIXED32",
    TYPE_BOOL = "TYPE_BOOL",
    TYPE_STRING = "TYPE_STRING",
    TYPE_GROUP = "TYPE_GROUP",
    TYPE_MESSAGE = "TYPE_MESSAGE",
    TYPE_BYTES = "TYPE_BYTES",
    TYPE_UINT32 = "TYPE_UINT32",
    TYPE_ENUM = "TYPE_ENUM",
    TYPE_SFIXED32 = "TYPE_SFIXED32",
    TYPE_SFIXED64 = "TYPE_SFIXED64",
    TYPE_SINT32 = "TYPE_SINT32",
    TYPE_SINT64 = "TYPE_SINT64"
}
export declare enum FieldCardinality {
    CARDINALITY_UNKNOWN = "CARDINALITY_UNKNOWN",
    CARDINALITY_OPTIONAL = "CARDINALITY_OPTIONAL",
    CARDINALITY_REQUIRED = "CARDINALITY_REQUIRED",
    CARDINALITY_REPEATED = "CARDINALITY_REPEATED"
}
export type Type = {
    name?: string;
    fields?: Field[];
    oneofs?: string[];
    options?: Option[];
    sourceContext?: GoogleProtobufSource_context.SourceContext;
    syntax?: Syntax;
};
export type Field = {
    kind?: FieldKind;
    cardinality?: FieldCardinality;
    number?: number;
    name?: string;
    typeUrl?: string;
    oneofIndex?: number;
    packed?: boolean;
    options?: Option[];
    jsonName?: string;
    defaultValue?: string;
};
export type Enum = {
    name?: string;
    enumvalue?: EnumValue[];
    options?: Option[];
    sourceContext?: GoogleProtobufSource_context.SourceContext;
    syntax?: Syntax;
};
export type EnumValue = {
    name?: string;
    number?: number;
    options?: Option[];
};
export type Option = {
    name?: string;
    value?: GoogleProtobufAny.Any;
};
//# sourceMappingURL=type.pb.d.ts.map