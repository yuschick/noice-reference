"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiInput = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const EmojiInput_module_css_1 = __importDefault(require("./EmojiInput.module.css"));
const useEditableDiv_hook_1 = require("./hooks/useEditableDiv.hook");
const _chat_utils_1 = require("@chat-utils");
exports.EmojiInput = (0, react_1.forwardRef)(({ placeholder, onChange, onEnter, allowOutsideEnter, disabled, emojiList, disallowDroppedContent, }, ref) => {
    const { inputRef, showPlaceholder, messageLength, messageRef, handleInput, handleKeyDown, handlePaste, updateMessage, addText, } = (0, useEditableDiv_hook_1.useEditableDiv)({
        onChange,
        onEnter,
        allowOutsideEnter,
        disallowDroppedContent,
        disabled: !!disabled,
    });
    (0, react_1.useImperativeHandle)(ref, () => ({
        addEmoji: (emoji) => {
            var _a, _b;
            const emojiDef = emojiList[emoji];
            if (!emojiDef || !inputRef.current) {
                return;
            }
            if (messageLength.current + emojiDef.label.length >= useEditableDiv_hook_1.INPUT_MAX_LENGTH) {
                return;
            }
            /*
            To avoid adding all emojis to the start of the inputRef
            use getSelection, remove breaks and set the cursor to the end
            of the input text range with collapseToEnd.
            */
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            const sel = document.getSelection();
            inputRef.current.innerHTML = inputRef.current.innerHTML.replace('<br>', '');
            sel === null || sel === void 0 ? void 0 : sel.selectAllChildren(inputRef.current);
            sel === null || sel === void 0 ? void 0 : sel.collapseToEnd();
            (0, _chat_utils_1.handlePasteHtmlAtCaret)((0, _chat_utils_1.generateEmojiImg)(emojiDef));
            (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.focus();
            updateMessage();
        },
        replacePartialMatchWithEmoji: (partialMatch, emoji) => {
            const element = inputRef.current;
            const emojiDef = emojiList[emoji];
            if (!element || !emojiDef) {
                return;
            }
            if (messageLength.current + emojiDef.label.length >= useEditableDiv_hook_1.INPUT_MAX_LENGTH) {
                return;
            }
            const childNode = (0, _chat_utils_1.findChildNodeIncludingText)(element, partialMatch);
            const selection = window.getSelection();
            if (!selection || !childNode) {
                return;
            }
            const startIndex = (0, _chat_utils_1.getIndexOfNodeText)(childNode, partialMatch);
            (0, _chat_utils_1.selectText)(childNode, startIndex, startIndex + partialMatch.length);
            (0, _chat_utils_1.handlePasteHtmlAtCaret)((0, _chat_utils_1.generateEmojiImg)(emojiDef));
            updateMessage();
        },
        focus: () => {
            var _a;
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        },
        get value() {
            return messageRef.current;
        },
        set value(msg) {
            if (msg === messageRef.current) {
                return;
            }
            if (!inputRef.current) {
                return;
            }
            inputRef.current.innerHTML = '<br>';
            addText(msg);
        },
    }), [updateMessage, addText, emojiList, messageRef, messageLength, inputRef]);
    return ((0, jsx_runtime_1.jsx)("div", { "aria-label": placeholder, className: (0, classnames_1.default)(EmojiInput_module_css_1.default.emojiInputContainer, {
            [EmojiInput_module_css_1.default.showPlaceholder]: showPlaceholder,
        }), contentEditable: !disabled, "data-placeholder": placeholder, ref: inputRef, role: "textbox", tabIndex: 0, onInput: handleInput, onKeyDown: handleKeyDown, onPaste: handlePaste }));
});
//# sourceMappingURL=EmojiInput.js.map