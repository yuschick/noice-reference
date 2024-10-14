"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialMatch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PartialMatch_module_css_1 = __importDefault(require("./PartialMatch.module.css"));
function PartialMatch({ text, partialMatch }) {
    const matchRegExp = new RegExp(`(${partialMatch})`.replace(/:/g, ''), 'gi');
    const textParts = text.split(matchRegExp);
    function renderTextParts() {
        return textParts
            .filter((part) => part)
            .map((part, i) => matchRegExp.test(part.replace(/:/g, '')) ? ((0, jsx_runtime_1.jsx)("mark", { className: PartialMatch_module_css_1.default.partialMatch, children: part }, i)) : ((0, jsx_runtime_1.jsx)("span", { children: part }, i)));
    }
    return (0, jsx_runtime_1.jsx)("span", { children: renderTextParts() });
}
exports.PartialMatch = PartialMatch;
//# sourceMappingURL=PartialMatch.js.map