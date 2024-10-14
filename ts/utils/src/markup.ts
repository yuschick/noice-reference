export type CustomNode = {
  tag: string;
  attribute?: string;
  children: (CustomNode | string)[];
};

const tokenize = (markup: string) => {
  const tokens: string[] = [];
  let currentToken = '';

  for (let i = 0; i < markup.length; i++) {
    const char = markup[i];

    // Start of tag
    if (char === '<') {
      // If current token exists, save it to token array and reset current token
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = '';
      }

      // Add to current token
      currentToken += char;
      continue;
    }

    // End of tag
    if (char === '>') {
      // Add char to current token and save current token to token array
      currentToken += char;
      tokens.push(currentToken);

      // Reset current token
      currentToken = '';
      continue;
    }

    // Save char to current token
    currentToken += char;
  }

  // Save last token to array, if there is one
  if (currentToken) {
    tokens.push(currentToken);
  }

  return tokens;
};

export const parseMarkup = (markup: string): (CustomNode | string)[] => {
  const tokens = tokenize(markup);

  let parent: CustomNode = {
    tag: 'body',
    children: [],
  };
  const stack = [parent];

  tokens.forEach((token) => {
    // If token is closing tag
    if (token.startsWith('</')) {
      const tag = token.substring(2, token.length - 1);

      // Open tag do not match with the closing tag
      if (tag !== parent.tag) {
        throw new Error(`Unexpected closing tag ${tag}`);
      }

      // Parent is the latest node in stack
      parent = stack.pop();
      return;
    }

    // If token is start tag
    if (token.startsWith('<')) {
      const tagWithAttribute = token.substring(1, token.length - 1);
      const attributeResult = tagWithAttribute.match(/(\w*)=(".*")/);

      // If tag matches, it has attribute, if not, it is just tag
      const tag = attributeResult?.[1] ?? tagWithAttribute;
      const attribute = attributeResult?.[2];

      // This is the new children for parent
      const node = {
        tag,
        attribute: attribute ? JSON.parse(attribute) : undefined,
        children: [] as (CustomNode | string)[],
      };
      parent.children.push(node);

      // Parent is the latest node in stack
      stack.push(parent);

      // Start new parent
      parent = node;

      return;
    }

    // Token is not tag, string is new children for parent
    parent.children.push(token);
  });

  return parent.children;
};

export const paragrapher = (markup: string): string =>
  markup
    // Split by line break
    .split(/\n/)
    // Trim content
    .map((paragraph) => paragraph.trim())
    // Filter out if empty content
    .filter((paragraph) => !!paragraph)
    // Add tags
    .map((paragraph) => `<paragraph>${paragraph}</paragraph>`)
    // Join to one string
    .join('');
