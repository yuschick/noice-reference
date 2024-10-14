"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialEmojiMatches = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const ChatDrawer_1 = require("../../ChatDrawer");
const ChatEmoji_1 = require("../../ChatEmoji");
const PartialEmojiMatches_module_css_1 = __importDefault(require("./PartialEmojiMatches.module.css"));
const PartialMatch_1 = require("./PartialMatch");
function PartialEmojiMatches({ className, emojiMatches, showDrawer, partialText, emojiList, onSelectEmoji, onOutsideClick, }) {
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const [prevIndex, nextIndex] = (0, common_ui_1.useCircularArrayNavigation)(emojiMatches, selectedIndex);
    const partialEmojis = (0, react_1.useRef)([]);
    const onArrowUp = (0, react_1.useCallback)((ev) => {
        if (emojiMatches.length === 0) {
            return;
        }
        ev.preventDefault();
        setSelectedIndex(prevIndex);
        // Scroll to the selected emoji
        if (partialEmojis.current[prevIndex]) {
            partialEmojis.current[prevIndex].scrollIntoView();
        }
    }, [prevIndex, emojiMatches]);
    const onArrowDown = (0, react_1.useCallback)((ev) => {
        if (emojiMatches.length === 0) {
            return;
        }
        ev.preventDefault();
        setSelectedIndex(nextIndex);
        // Scroll to the selected emoji
        if (partialEmojis.current[nextIndex]) {
            partialEmojis.current[nextIndex].scrollIntoView();
        }
    }, [nextIndex, emojiMatches]);
    const onEnter = (0, react_1.useCallback)((ev) => {
        if (emojiMatches.length === 0) {
            return;
        }
        ev.preventDefault();
        const selectedEmoji = emojiMatches[selectedIndex];
        onSelectEmoji(selectedEmoji);
    }, [emojiMatches, selectedIndex, onSelectEmoji]);
    (0, common_ui_1.useKeyPress)(common_ui_1.KeyboardKeys.ArrowUp, onArrowUp);
    (0, common_ui_1.useKeyPress)(common_ui_1.KeyboardKeys.ArrowDown, onArrowDown);
    (0, common_ui_1.useKeyPress)(common_ui_1.KeyboardKeys.Enter, onEnter);
    (0, common_ui_1.useKeyPress)(common_ui_1.KeyboardKeys.Tab, onEnter);
    const onMouseEnter = (0, react_1.useCallback)((index) => setSelectedIndex(index), []);
    (0, react_1.useEffect)(() => {
        setSelectedIndex(0);
    }, [emojiMatches]);
    return ((0, jsx_runtime_1.jsx)(ChatDrawer_1.ChatDrawer, { className: className, showDrawer: showDrawer, onOutsideClick: onOutsideClick, children: emojiMatches.map((emoji, index) => {
            const emojiDef = emojiList[emoji];
            return ((0, jsx_runtime_1.jsxs)("button", { className: (0, classnames_1.default)(PartialEmojiMatches_module_css_1.default.row, {
                    [PartialEmojiMatches_module_css_1.default.selected]: index === selectedIndex,
                }), ref: (element) => {
                    if (element) {
                        partialEmojis.current[index] = element;
                    }
                }, onClick: () => onSelectEmoji(emoji), onMouseEnter: () => onMouseEnter(index), children: [(0, jsx_runtime_1.jsx)(ChatEmoji_1.ChatEmoji, { emoji: emojiDef.label, source: emojiDef.source, disableTooltip: true }), (0, jsx_runtime_1.jsx)("span", { className: PartialEmojiMatches_module_css_1.default.label, children: (0, jsx_runtime_1.jsx)(PartialMatch_1.PartialMatch, { partialMatch: partialText, text: emojiDef.label }) })] }, emojiDef.itemId));
        }) }));
}
exports.PartialEmojiMatches = PartialEmojiMatches;
//# sourceMappingURL=PartialEmojiMatches.js.map