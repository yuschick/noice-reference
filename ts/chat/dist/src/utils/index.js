"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeletedChatMessage = exports.getIndexOfNodeText = exports.findChildNodeIncludingText = exports.selectText = exports.handlePasteHtmlAtCaret = exports.generateEmojiImg = exports.getChatMessageText = exports.parseEmojisFromMessage = void 0;
var text_parsing_1 = require("./text-parsing");
Object.defineProperty(exports, "parseEmojisFromMessage", { enumerable: true, get: function () { return text_parsing_1.parseEmojisFromMessage; } });
Object.defineProperty(exports, "getChatMessageText", { enumerable: true, get: function () { return text_parsing_1.getChatMessageText; } });
Object.defineProperty(exports, "generateEmojiImg", { enumerable: true, get: function () { return text_parsing_1.generateEmojiImg; } });
var text_interaction_1 = require("./text-interaction");
Object.defineProperty(exports, "handlePasteHtmlAtCaret", { enumerable: true, get: function () { return text_interaction_1.handlePasteHtmlAtCaret; } });
Object.defineProperty(exports, "selectText", { enumerable: true, get: function () { return text_interaction_1.selectText; } });
var node_text_1 = require("./node-text");
Object.defineProperty(exports, "findChildNodeIncludingText", { enumerable: true, get: function () { return node_text_1.findChildNodeIncludingText; } });
Object.defineProperty(exports, "getIndexOfNodeText", { enumerable: true, get: function () { return node_text_1.getIndexOfNodeText; } });
var chat_message_1 = require("./chat-message");
Object.defineProperty(exports, "isDeletedChatMessage", { enumerable: true, get: function () { return chat_message_1.isDeletedChatMessage; } });
//# sourceMappingURL=index.js.map