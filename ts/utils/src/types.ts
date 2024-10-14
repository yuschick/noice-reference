export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export type DeepRequired<T> = Required<{ [P in keyof T]: DeepRequired<T[P]> }>;
