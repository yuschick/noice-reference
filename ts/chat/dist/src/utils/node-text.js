"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexOfNodeText = exports.findChildNodeIncludingText = void 0;
const findChildNodeIncludingText = (element, text) => {
    const childNodes = Array.from(element.childNodes);
    const childNode = childNodes.find((node) => { var _a; return (_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.includes(text); });
    return childNode !== null && childNode !== void 0 ? childNode : null;
};
exports.findChildNodeIncludingText = findChildNodeIncludingText;
const getIndexOfNodeText = (node, text) => { var _a, _b; return (_b = (_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.indexOf(text)) !== null && _b !== void 0 ? _b : -1; };
exports.getIndexOfNodeText = getIndexOfNodeText;
//# sourceMappingURL=node-text.js.map