/**
 * Converts a string to camel case.
 * @param str The string to convert.
 * @returns The camel case string.
 *
 * @note This only converts from kebab-case, since that is what the
 * design tokens are in as they are written as they are in css. If
 * we decide we need a more robust solution, we can do that later.
 */
export const convertToCamelCase = (str: string) =>
  str
    .toLowerCase()
    .split('-')
    .reduce((acc, word) => {
      if (word === '') {
        return acc;
      }

      // Ensure the first character is always lowercase
      if (acc === '') {
        return word;
      }

      return acc + word[0].toUpperCase() + word.slice(1);
    }, '');
