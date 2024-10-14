"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditableDiv = exports.INPUT_MAX_LENGTH = void 0;
const react_1 = require("react");
const _chat_hooks_1 = require("@chat-hooks");
const _chat_utils_1 = require("@chat-utils");
const emojiRegex = /:(\w+):/gi;
// keys that are allow even when editing is forbidden (too long message etc.)
const alwaysAllowedKeys = [
    'ArrowUp',
    'ArrowDown',
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
];
exports.INPUT_MAX_LENGTH = 225;
function useEditableDiv({ onChange, onEnter, allowOutsideEnter, disallowDroppedContent, disabled, }) {
    const messageRef = (0, react_1.useRef)('');
    const [showPlaceholder, setShowPlaceholder] = (0, react_1.useState)(true);
    const messageLength = (0, react_1.useRef)(0);
    const inputRef = (0, react_1.useRef)(null);
    const { emojiList, emojis } = (0, _chat_hooks_1.useUserInventoryEmojis)();
    const updateMessage = (0, react_1.useCallback)(() => {
        const element = inputRef.current;
        if (!element) {
            return;
        }
        const cloneElement = element.cloneNode(true);
        const images = Array.from(cloneElement.querySelectorAll('img'));
        const updatedMessageLength = cloneElement.innerText.replace(/\n$/, '').length;
        let imagesLength = 0;
        images.forEach((image) => {
            image.outerHTML = image.alt;
            imagesLength += image.alt.length;
        });
        const message = cloneElement.innerText.replace(/\n$/, '');
        messageRef.current = message;
        setShowPlaceholder(!message.length);
        messageLength.current = updatedMessageLength + imagesLength;
        onChange(message);
    }, [onChange]);
    const addText = (0, react_1.useCallback)((text, textMaxLength = exports.INPUT_MAX_LENGTH) => {
        let messageEmojis = (0, _chat_utils_1.parseEmojisFromMessage)(text, emojis);
        const emojiLabelsLength = messageEmojis.reduce((prev, curr) => {
            return (prev += curr.label.length);
        }, 0);
        const textLength = text.length - emojiLabelsLength + messageEmojis.length;
        if (textLength > textMaxLength) {
            // Handle emojis
            if (messageEmojis.length) {
                let point = 0;
                text = messageEmojis.reduce((prev, curr) => {
                    // Nothing fits in
                    if (point >= textMaxLength) {
                        return prev;
                    }
                    // Only (some) text before emoji fits in
                    if (curr.startIndex >= textMaxLength) {
                        prev += text.slice(point, textMaxLength);
                        point = textMaxLength;
                        return prev;
                    }
                    // Emoji and text before fits in
                    prev += text.slice(point, curr.endIndex + 1);
                    point = curr.endIndex + 1;
                    // correct max length
                    textMaxLength += curr.label.length - 1;
                    return prev;
                }, '');
                // Fetch emojis again as there might be less
                messageEmojis = (0, _chat_utils_1.parseEmojisFromMessage)(text, emojis);
            }
            // Just slice if no emojis
            else {
                text = text.slice(0, textMaxLength);
            }
        }
        let startingPoint = 0;
        const textWithEmojis = messageEmojis.map((emoji) => {
            const textPortion = `${text.substring(startingPoint, emoji.startIndex)}${(0, _chat_utils_1.generateEmojiImg)(emoji)}`;
            // Set the starting point to the end index and go again
            startingPoint = emoji.endIndex + 1;
            return textPortion;
        });
        if (startingPoint < text.length) {
            textWithEmojis.push(text.substring(startingPoint));
        }
        text = textWithEmojis.join('');
        (0, _chat_utils_1.handlePasteHtmlAtCaret)(text);
        updateMessage();
    }, [updateMessage, emojis]);
    const handleInput = (0, react_1.useCallback)(() => {
        const element = inputRef.current;
        if (!element) {
            return;
        }
        const emojiMatches = [...element.innerText.matchAll(emojiRegex)];
        // There is no emoji syntax used
        if (!emojiMatches.length) {
            updateMessage();
            return;
        }
        emojiMatches.forEach((emojiMatch) => {
            var _a;
            // There is no emoji syntax used
            if (!emojiMatch[1]) {
                updateMessage();
                return;
            }
            const emojiName = (_a = emojis.find((emoji) => emoji.label.toLowerCase() === emojiMatch[1].toLowerCase())) === null || _a === void 0 ? void 0 : _a.label;
            // No emoji with that syntax
            if (!emojiName) {
                updateMessage();
                return;
            }
            const emoji = emojiList[emojiName];
            const childNode = (0, _chat_utils_1.findChildNodeIncludingText)(element, emojiMatch[0]);
            const selection = window.getSelection();
            if (!selection || !childNode) {
                updateMessage();
                return;
            }
            const startIndex = (0, _chat_utils_1.getIndexOfNodeText)(childNode, emojiMatch[0]);
            // select emoji text
            (0, _chat_utils_1.selectText)(childNode, startIndex, startIndex + emoji.label.length);
            // replace with img
            (0, _chat_utils_1.handlePasteHtmlAtCaret)((0, _chat_utils_1.generateEmojiImg)(emoji));
        });
        updateMessage();
    }, [updateMessage, emojiList, emojis]);
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        if (event.key === 'Enter' && !allowOutsideEnter) {
            event.preventDefault();
            // Run given function
            onEnter(event);
            return;
        }
        // always allow meta and ctrl keys
        if (event.metaKey || event.ctrlKey) {
            return;
        }
        if (alwaysAllowedKeys.includes(event.key)) {
            return;
        }
        if (messageLength.current >= exports.INPUT_MAX_LENGTH) {
            event.preventDefault();
        }
    }, [onEnter, allowOutsideEnter]);
    const handlePaste = (0, react_1.useCallback)((event) => {
        event.preventDefault();
        if (disabled) {
            return;
        }
        const clipboardData = event.clipboardData;
        const pastedData = clipboardData.getData('Text');
        addText(pastedData, exports.INPUT_MAX_LENGTH - messageLength.current);
    }, [addText, disabled]);
    (0, react_1.useEffect)(() => {
        const element = inputRef.current;
        if (!element || !disallowDroppedContent) {
            return;
        }
        element.addEventListener('drop', (e) => e.preventDefault());
        return element.removeEventListener('drop', (e) => e.preventDefault());
    }, [disallowDroppedContent]);
    (0, react_1.useEffect)(() => {
        const element = inputRef.current;
        if (!element) {
            return;
        }
        element.innerHTML = '<br>';
    }, []);
    return {
        showPlaceholder,
        inputRef,
        messageLength,
        messageRef,
        handleInput,
        handlePaste,
        handleKeyDown,
        updateMessage,
        addText,
    };
}
exports.useEditableDiv = useEditableDiv;
//# sourceMappingURL=useEditableDiv.hook.js.map