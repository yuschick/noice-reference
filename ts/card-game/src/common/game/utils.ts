const CUSTOM_KEY = /{{(\w+)}}/; // eslint-disable-line @typescript-eslint/naming-convention
const CUSTOM_KEYS = new RegExp(CUSTOM_KEY, 'g'); // eslint-disable-line @typescript-eslint/naming-convention

// Matches e.g. {{globals.lastScoringPlayer|Last Scoring Player}}
// and the first group is "lastScoringPlayer" and second group is "Last Scoring Player"
// If default value is missing, no second group will be present
// eslint-disable-next-line @typescript-eslint/naming-convention
const GLOBALS_REGEXP = /{{globals\.([a-zA-Z0-9_]+)(?:\|([^}]*))?}}/g;

/** Matches all globals, e.g.
 * "{{globals.lastScoringPlayer|Last Scoring Player}} foo {{globals.somethingElse|some default}}"
 * returns
 * [
 *  ["{{globals.lastScoringPlayer|Last Scoring Player}}", "lastScoringPlayer", "Last Scoring Player"],
 *  ["{{globals.somethingElse|some default}}", "somethingElse", "some default"]
 * ]
 */
export const findGlobals = (str: string) => {
  const matches = [...str.matchAll(GLOBALS_REGEXP)];

  return matches ? matches : [];
};

export const isCustomKey = (text: string): string | null => {
  const matches = text.match(CUSTOM_KEY);

  return matches && matches.length === 2 ? matches[1] : null;
};

export const findCustomKeys = (str: string) => {
  const matches = str.match(CUSTOM_KEYS);

  return matches ? matches : [];
};

export const splitAndKeepSeparator = (str: string, separator: string) => {
  const parts = str.split(separator);
  const result = [parts[0]];

  for (let i = 1; i < parts.length; i++) {
    result.push(separator, parts[i]);
  }

  return result;
};
