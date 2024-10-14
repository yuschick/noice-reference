export const handlePasteHtmlAtCaret = (
  html: string,
  parentElement: HTMLElement,
): void => {
  const selection = window.getSelection();
  let range = selection?.getRangeAt(0);

  if (
    !selection ||
    !range?.commonAncestorContainer ||
    // Ignore paste if the selection is not inside the wanted parent element
    !parentElement.contains(range.commonAncestorContainer)
  ) {
    return;
  }

  range.deleteContents();

  // Helper element
  const element = document.createElement('div');
  element.innerHTML = html;

  // The fragment
  const fragment = document.createDocumentFragment();

  // Append element's child to fragment
  let node, lastNode;

  while ((node = element.firstChild)) {
    lastNode = fragment.appendChild(node);
  }

  // Insert fragment to the point
  range.insertNode(fragment);

  // Move selection to after last node
  if (lastNode) {
    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const selectText = (node: Node, startIndex: number, endIndex: number): void => {
  const selection = window.getSelection();

  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.setStart(node, startIndex);
  range.setEnd(node, endIndex);
  selection.removeAllRanges();
  selection.addRange(range);
};
