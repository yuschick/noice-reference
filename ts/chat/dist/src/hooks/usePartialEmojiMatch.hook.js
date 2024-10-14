"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePartialEmojiMatch = void 0;
const common_ui_1 = require("@noice-com/common-ui");
const utils_1 = require("@noice-com/utils");
const react_1 = require("react");
const useUserInventoryEmojis_hook_1 = require("./useUserInventoryEmojis.hook");
const partialEmojiRegex = /(^|\s):(\w+)$/gi;
const MINIMUM_CHARS_FOR_SUGGESTION = 2;
function usePartialEmojiMatch() {
    const [partialEmojiMatch, setPartialEmojiMatch] = (0, react_1.useState)(null);
    const clear = (0, react_1.useCallback)(() => setPartialEmojiMatch(null), []);
    const { emojis } = (0, useUserInventoryEmojis_hook_1.useUserInventoryEmojis)();
    const onInputChange = (0, react_1.useCallback)(() => {
        var _a, _b;
        const selection = window.getSelection();
        if (!selection || !((_a = selection.focusNode) === null || _a === void 0 ? void 0 : _a.nodeValue)) {
            clear();
            return;
        }
        const textBeforeCaret = (_b = selection.focusNode) === null || _b === void 0 ? void 0 : _b.nodeValue.substring(0, selection.focusOffset);
        const possiblePartialEmojiMatch = textBeforeCaret.match(partialEmojiRegex);
        if (!possiblePartialEmojiMatch) {
            clear();
            return;
        }
        const text = possiblePartialEmojiMatch[0].replace(' ', '');
        const textWithoutColon = text.replace(':', '');
        if (textWithoutColon.length < MINIMUM_CHARS_FOR_SUGGESTION) {
            clear();
            return;
        }
        const matchingEmojis = emojis
            .filter(({ label }) => {
            const matchRegExp = new RegExp(`(${textWithoutColon})`, 'gi');
            return matchRegExp.test(label.replace(/-/g, '')) ? label : undefined;
        })
            .map(({ label }) => label);
        if (matchingEmojis.length === 0) {
            clear();
            return;
        }
        setPartialEmojiMatch({ text, matchingEmojis: matchingEmojis });
    }, [clear, emojis]);
    (0, common_ui_1.useKeyPress)(utils_1.KeyboardKeys.ArrowLeft, clear);
    (0, common_ui_1.useKeyPress)(utils_1.KeyboardKeys.ArrowRight, clear);
    (0, common_ui_1.useKeyPress)(utils_1.KeyboardKeys.Escape, clear);
    return {
        partialEmojiMatch,
        onInputChange,
        clear,
    };
}
exports.usePartialEmojiMatch = usePartialEmojiMatch;
//# sourceMappingURL=usePartialEmojiMatch.hook.js.map