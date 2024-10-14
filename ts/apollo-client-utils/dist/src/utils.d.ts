/**
 * @param storeFieldName - Apollo cache store field name, e.g. `streamerCards({channelId: "123"})`
 * @param fieldName - Apollo cache field name, e.g. `streamerCards`
 * @returns - Object with variables, e.g. `{channelId: "123"}`
 */
export declare const getFieldsVariables: <T>(storeFieldName: string, fieldName: string) => T;
type NoUndefinedField<T> = {
    [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
/**
 *
 * @param args query variables for Apollo graphql query
 * @returns either skip: true or variables: NoUndefinedField<TVariables>
 */
export declare function variablesOrSkip<TVariables>(args: Partial<TVariables>): {
    skip: true;
} | {
    variables: NoUndefinedField<TVariables>;
    skip: false;
};
export {};
