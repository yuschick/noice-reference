"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectText = exports.handlePasteHtmlAtCaret = void 0;
const handlePasteHtmlAtCaret = (html) => {
    const selection = window.getSelection();
    let range = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0);
    if (!selection || !range) {
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
exports.handlePasteHtmlAtCaret = handlePasteHtmlAtCaret;
const selectText = (node, startIndex, endIndex) => {
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
exports.selectText = selectText;
//# sourceMappingURL=text-interaction.js.map