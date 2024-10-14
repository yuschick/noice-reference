"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInputForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const hi_1 = require("react-icons/hi");
const md_1 = require("react-icons/md");
const EmojiDrawer_1 = require("../EmojiDrawer");
const EmojiInput_1 = require("../EmojiInput");
const ChatInputForm_module_css_1 = __importDefault(require("./ChatInputForm.module.css"));
const CommandDrawer_1 = require("./CommandDrawer");
const hooks_1 = require("./hooks");
const PartialEmojiMatches_1 = require("./PartialEmojiMatches");
const _chat_hooks_1 = require("@chat-hooks");
const commandRegex = /^\/[\w-]*$/;
function ChatInputForm({ disabled, sendMessage, placeholder, replyTo, onReplyCancel, sendTriggerEmote, }) {
    var _a, _b, _c, _d;
    const [showEmojiDrawer, setShowEmojiDrawer] = (0, react_1.useState)(false);
    const [commands, setCommands] = (0, react_1.useState)([]);
    const [activeCommandIndex, setActiveCommandIndex] = (0, react_1.useState)(0);
    const emojiInputRef = (0, react_1.useRef)(null);
    const { emojiList, emojisByChannel, noiceEmojis } = (0, _chat_hooks_1.useUserInventoryEmojis)();
    const { movements } = (0, hooks_1.useAvatarMovements)();
    // Input does not take care of ArrowUp nor ArrowDown
    const onKeyDown = (0, react_1.useCallback)((e) => {
        if (!commands.length) {
            return;
        }
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            // If active index is already at bottom, do nothing
            if (activeCommandIndex === commands.length - 1) {
                return;
            }
            setActiveCommandIndex(activeCommandIndex + 1);
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            // If active index is already at top, do nothing
            if (activeCommandIndex === 0) {
                return;
            }
            setActiveCommandIndex(activeCommandIndex - 1);
            return;
        }
    }, [activeCommandIndex, commands.length]);
    // Focus when reply added
    (0, react_1.useEffect)(() => {
        var _a;
        if (!replyTo) {
            return;
        }
        (_a = emojiInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, [replyTo, emojiInputRef]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [commands, activeCommandIndex, onKeyDown]);
    // Every time commands change, set active index back to top
    (0, react_1.useEffect)(() => {
        setActiveCommandIndex(0);
    }, [commands]);
    const onSendClicked = (0, react_1.useCallback)(() => {
        if (!emojiInputRef.current) {
            return;
        }
        const message = emojiInputRef.current.value;
        if (message !== '') {
            sendMessage(replyTo ? `@${replyTo} ${message}` : message);
            setShowEmojiDrawer(false);
            onReplyCancel();
            emojiInputRef.current.value = '';
        }
        emojiInputRef.current.focus();
    }, [sendMessage, onReplyCancel, replyTo]);
    const onEmojiClicked = (0, react_1.useCallback)((emoji) => {
        if (!emojiInputRef.current) {
            return;
        }
        emojiInputRef.current.addEmoji(emoji);
    }, []);
    const onCommandClick = (0, react_1.useCallback)((command) => {
        if (!emojiInputRef.current) {
            return;
        }
        emojiInputRef.current.value = '';
        if (sendTriggerEmote) {
            sendTriggerEmote(command);
        }
    }, [sendTriggerEmote]);
    const handleEnter = (0, react_1.useCallback)(() => {
        // If there is commands, run active one
        if (commands.length && commands[activeCommandIndex]) {
            onCommandClick(commands[activeCommandIndex].id);
            return;
        }
        // Otherwise send message
        onSendClicked();
    }, [activeCommandIndex, commands, onCommandClick, onSendClicked]);
    const onEmojiDrawerButton = (0, react_1.useCallback)(() => {
        setShowEmojiDrawer((currentShowEmojiDrawer) => !currentShowEmojiDrawer);
    }, []);
    const SendIcon = common_ui_1.CommonAssets.Icons.Send;
    const { partialEmojiMatch, onInputChange, clear } = (0, _chat_hooks_1.usePartialEmojiMatch)();
    const onSelectEmojiForPartialMatch = (0, react_1.useCallback)((emoji) => {
        var _a;
        if (!partialEmojiMatch) {
            return;
        }
        (_a = emojiInputRef.current) === null || _a === void 0 ? void 0 : _a.replacePartialMatchWithEmoji(partialEmojiMatch.text, emoji);
        clear();
    }, [partialEmojiMatch, clear]);
    const onChange = (0, react_1.useCallback)((text) => {
        const commandMatches = text.match(commandRegex);
        if ((commandMatches === null || commandMatches === void 0 ? void 0 : commandMatches[0]) && movements.length) {
            setCommands(movements.filter(({ chatCommand }) => chatCommand.startsWith(commandMatches[0])));
        }
        else {
            setCommands([]);
        }
        onInputChange();
    }, [movements, onInputChange]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, classnames_1.default)(ChatInputForm_module_css_1.default.wrapper, {
            [ChatInputForm_module_css_1.default.showEmojiDrawer]: showEmojiDrawer,
        }), children: [(0, jsx_runtime_1.jsx)(PartialEmojiMatches_1.PartialEmojiMatches, { className: ChatInputForm_module_css_1.default.partialEmojiMatches, emojiList: emojiList, emojiMatches: (_a = partialEmojiMatch === null || partialEmojiMatch === void 0 ? void 0 : partialEmojiMatch.matchingEmojis) !== null && _a !== void 0 ? _a : [], partialText: (_b = partialEmojiMatch === null || partialEmojiMatch === void 0 ? void 0 : partialEmojiMatch.text) !== null && _b !== void 0 ? _b : '', showDrawer: !!partialEmojiMatch, onOutsideClick: clear, onSelectEmoji: onSelectEmojiForPartialMatch }), (0, jsx_runtime_1.jsx)(EmojiDrawer_1.EmojiDrawer, { className: ChatInputForm_module_css_1.default.emojiDrawer, emojiList: emojiList, emojisByChannel: emojisByChannel, noiceEmojis: noiceEmojis, showDrawer: showEmojiDrawer, onEmojiClicked: onEmojiClicked, onOutsideClick: () => {
                    setShowEmojiDrawer(false);
                } }), (0, jsx_runtime_1.jsx)(CommandDrawer_1.CommandDrawer, { activeCommand: (_c = commands[activeCommandIndex]) === null || _c === void 0 ? void 0 : _c.id, className: ChatInputForm_module_css_1.default.commandDrawer, commands: commands, showDrawer: !!commands.length, onCommandClick: onCommandClick, onMouseEnter: (id) => {
                    setActiveCommandIndex(commands.findIndex((command) => command.id === id));
                } }), !!replyTo && ((0, jsx_runtime_1.jsxs)("div", { className: ChatInputForm_module_css_1.default.replyToContainer, children: [(0, jsx_runtime_1.jsx)("span", { className: ChatInputForm_module_css_1.default.replyLabel, children: `replying to @${replyTo}` }), (0, jsx_runtime_1.jsx)(common_ui_1.IconButton, { icon: md_1.MdClose, label: "close", size: "sm", variant: "ghost", onClick: onReplyCancel })] })), (0, jsx_runtime_1.jsxs)("div", { className: ChatInputForm_module_css_1.default.container, children: [(0, jsx_runtime_1.jsxs)("div", { className: ChatInputForm_module_css_1.default.inputContainer, children: [(0, jsx_runtime_1.jsx)(EmojiInput_1.EmojiInput, { allowOutsideEnter: !!partialEmojiMatch, disabled: disabled, emojiList: emojiList, placeholder: placeholder, ref: emojiInputRef, disallowDroppedContent: true, onChange: onChange, onEnter: handleEnter }), (0, jsx_runtime_1.jsx)("div", { className: ChatInputForm_module_css_1.default.emojiDrawerButtonContainer, children: (0, jsx_runtime_1.jsx)(common_ui_1.IconButton, { icon: hi_1.HiOutlineEmojiHappy, isDisabled: disabled, label: "Toggle emoji drawer", size: "sm", variant: "ghost", onClick: onEmojiDrawerButton }) })] }), (0, jsx_runtime_1.jsx)(common_ui_1.IconButton, { color: "light", icon: SendIcon, isDisabled: disabled || !((_d = emojiInputRef === null || emojiInputRef === void 0 ? void 0 : emojiInputRef.current) === null || _d === void 0 ? void 0 : _d.value), label: "Send chat message", size: "sm", onClick: onSendClicked })] })] }));
}
exports.ChatInputForm = ChatInputForm;
//# sourceMappingURL=ChatInputForm.js.map