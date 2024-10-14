export const padStart = (str: string, padding: string, targetLength: number): string => {
  // Floor length / convert to 0
  const length = targetLength >> 0;

  if (str.length > length) {
    return str;
  }

  const difference = length - str.length;
  const buffer = padding.repeat(difference / padding.length);

  return buffer.slice(0, difference) + str;
};

export const normalizePropertyName = (propertyName: string) =>
  propertyName
    // kebab-case to normal space
    .replace(/-/g, ' ')
    // snake_case to normal space
    .replace(/_/g, ' ')
    // camelCase to normal space
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Lower case upper cases that has space before it
    .replace(/\s([A-Z])/g, (str) => str.toLowerCase())
    // Uppercase the first character
    .replace(/^./, (str) => str.toUpperCase());

export const stringToKebabCase = (text: string): string => {
  return text.replace(/ /g, '-').toLowerCase();
};

// https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/
export const stringToHash = (str: string) => {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
};
