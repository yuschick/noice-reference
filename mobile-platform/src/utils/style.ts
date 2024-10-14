/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet } from 'react-native';

type NamedStyles<T> = StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>;

/**
 *
 * @param defaultStyles The default stylesheet
 * @param variations variations of the default stylesheets with overriden values example:
 * @returns returns a function that can be called to get a specific stylesheet
 * @example
 * <code>
 * // Add a variant
 * {
 *   large: {
 *      container: {
 *        width: 200
 *      }
 *   }
 * }
 *
 * // get the variant
 * const getStyleSheet = createStylesWithVariants(...);
 * getStyleSheet("large")
 * </code>
 */
export function createStylesWithVariants<Key extends string, T extends NamedStyles<T>>(
  defaultStyles: T,
  variations: Record<Key, NamedStyles<T>>,
) {
  return (key: Key | 'default'): T => {
    if (key === 'default' || !variations[key]) {
      return StyleSheet.create(defaultStyles);
    }

    const obj: any = { ...defaultStyles };
    const variation: any = variations[key];
    for (const propKey of Object.keys(variation)) {
      obj[propKey] = defaultStyles[propKey as keyof T] ?? {};
      obj[propKey] = {
        ...obj[propKey],
        ...variation[propKey],
      };
    }

    return StyleSheet.create<T>(obj);
  };
}
