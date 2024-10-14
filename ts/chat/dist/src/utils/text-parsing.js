"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmojiImg = exports.getChatMessageText = exports.parseEmojisFromMessage = void 0;
const chat_message_1 = require("./chat-message");
const parseEmojisFromMessage = (message, emojiDefs, fromIndex = 0, result = []) => {
    const start = message.indexOf(':', fromIndex);
    if (start === -1) {
        return result;
    }
    const forwardSearch = start + 1;
    // Message has end, so no need to continue
    if (forwardSearch === message.length) {
        return result;
    }
    // If the next character is a non-word character, skip
    if (message[forwardSearch].match(/\W/)) {
        return (0, exports.parseEmojisFromMessage)(message, emojiDefs, start + 1, result);
    }
    // If there isn't a following :, return
    const next = message.indexOf(':', forwardSearch);
    if (next === -1) {
        return result;
    }
    const label = message.slice(start, next + 1);
    const emoji = emojiDefs.find((def) => def.label.toLowerCase() === label.toLowerCase());
    // If we find an emoji, push it to results and continue
    const newResults = [...result];
    if (emoji) {
        newResults.push({
            label: emoji.label,
            source: emoji.source,
            startIndex: start,
            endIndex: next,
            itemId: emoji.itemId,
        });
    }
    return (0, exports.parseEmojisFromMessage)(message, emojiDefs, next + 1, newResults);
};
exports.parseEmojisFromMessage = parseEmojisFromMessage;
const getChatMessageText = (chatMessage) => {
    var _a, _b, _c;
    if ((0, chat_message_1.isDeletedChatMessage)(chatMessage)) {
        return 'Message was deleted by a moderator.';
    }
    return ((_b = (_a = chatMessage.content) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.__typename) === 'ChatTextMessage'
        ? (_c = chatMessage.content.content.text) !== null && _c !== void 0 ? _c : ''
        : 'Unsupported message type';
};
exports.getChatMessageText = getChatMessageText;
const generateEmojiImg = (emoji) => {
    return `<img alt="${emoji.label}" src="${emoji.source}" data-emoji-label="${emoji.label}" height="32px" >`;
};
exports.generateEmojiImg = generateEmojiImg;
//# sourceMappingURL=text-parsing.js.map