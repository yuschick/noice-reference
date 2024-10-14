export const findChildNodeIncludingText = (
  element: Element,
  text: string,
): Node | null => {
  const childNodes = Array.from(element.childNodes);
  const childNode = childNodes.find((node) => node.nodeValue?.includes(text));

  return childNode ?? null;
};

export const getIndexOfNodeText = (node: Node, text: string) =>
  node.nodeValue?.indexOf(text) ?? -1;
