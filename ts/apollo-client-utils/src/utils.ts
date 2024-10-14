/**
 * @param storeFieldName - Apollo cache store field name, e.g. `streamerCards({channelId: "123"})`
 * @param fieldName - Apollo cache field name, e.g. `streamerCards`
 * @returns - Object with variables, e.g. `{channelId: "123"}`
 */
export const getFieldsVariables = <T>(storeFieldName: string, fieldName: string): T => {
  /**
   * Find matches for regex where the variables are capture group,
   * e.g. `streamerCards({channelId: "123"})` -> `["streamerCards({channelId: "123"})", "{channelId: "123"}"]`
   *
   * Or replaces fieldName to later parse the variables string to object
   * e.g. "friends:{"userId":"e4491653-f9eb-47b5-8749-ecb028063bbd","priorityOrder":true}"
   */

  const result =
    storeFieldName.match(new RegExp(`${fieldName}\\((.*)\\)`)) ??
    storeFieldName.replace(`${fieldName}:`, '');

  /**
   * Parse the variables string to object
   * @returns object of arguments
   * e.g. `{ userId: "e4491653-f9eb-47b5-8749-ecb028063bbd", priorityOrder: true }`
   */
  return JSON.parse(Array.isArray(result) ? result?.[1] : result ?? {});
};

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };
/**
 *
 * @param args query variables for Apollo graphql query
 * @returns either skip: true or variables: NoUndefinedField<TVariables>
 */
export function variablesOrSkip<TVariables>(
  args: Partial<TVariables>,
): { skip: true } | { variables: NoUndefinedField<TVariables>; skip: false } {
  const hasInvalidValues = Object.values(args).some(
    (value) => value === null || value === undefined || value === '',
  );

  if (hasInvalidValues) {
    return { skip: true };
  } else {
    return { variables: args as NoUndefinedField<TVariables>, skip: false };
  }
}
