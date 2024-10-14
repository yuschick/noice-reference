"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variablesOrSkip = exports.getFieldsVariables = void 0;
/**
 * @param storeFieldName - Apollo cache store field name, e.g. `streamerCards({channelId: "123"})`
 * @param fieldName - Apollo cache field name, e.g. `streamerCards`
 * @returns - Object with variables, e.g. `{channelId: "123"}`
 */
const getFieldsVariables = (storeFieldName, fieldName) => {
    /**
     * Find matches for regex where the variables are capture group,
     * e.g. `streamerCards({channelId: "123"})` -> `["streamerCards({channelId: "123"})", "{channelId: "123"}"]`
     *
     * Or replaces fieldName to later parse the variables string to object
     * e.g. "friends:{"userId":"e4491653-f9eb-47b5-8749-ecb028063bbd","priorityOrder":true}"
     */
    var _a;
    const result = (_a = storeFieldName.match(new RegExp(`${fieldName}\\((.*)\\)`))) !== null && _a !== void 0 ? _a : storeFieldName.replace(`${fieldName}:`, '');
    /**
     * Parse the variables string to object
     * @returns object of arguments
     * e.g. `{ userId: "e4491653-f9eb-47b5-8749-ecb028063bbd", priorityOrder: true }`
     */
    return JSON.parse(Array.isArray(result) ? result === null || result === void 0 ? void 0 : result[1] : result !== null && result !== void 0 ? result : {});
};
exports.getFieldsVariables = getFieldsVariables;
/**
 *
 * @param args query variables for Apollo graphql query
 * @returns either skip: true or variables: NoUndefinedField<TVariables>
 */
function variablesOrSkip(args) {
    const hasInvalidValues = Object.values(args).some((value) => value === null || value === undefined || value === '');
    if (hasInvalidValues) {
        return { skip: true };
    }
    else {
        return { variables: args, skip: false };
    }
}
exports.variablesOrSkip = variablesOrSkip;
//# sourceMappingURL=utils.js.map