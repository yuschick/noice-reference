"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatEmojisAndMentions = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const react_1 = require("react");
const ChatEmoji_1 = require("../components/ChatEmoji");
function useChatEmojisAndMentions({ message, attachments, ownPlayerName, mentionClassName, emojiClassName, }) {
    const mentionsMe = (0, react_1.useRef)(false);
    const textNodeIndex = (0, react_1.useRef)(0);
    const mentionNodeIndex = (0, react_1.useRef)(0);
    const searchString = `@${ownPlayerName}`;
    const mentionRegExp = (0, react_1.useMemo)(() => new RegExp(`${searchString}\\b`, 'i'), [searchString]);
    const splitTextToNodesByMention = (text) => {
        const nodes = [];
        const mentionIndex = text.search(mentionRegExp);
        // If no mentions, return the text as one node
        if (mentionIndex < 0) {
            nodes.push((0, jsx_runtime_1.jsx)("span", { children: text }, `text:${textNodeIndex.current}`));
            textNodeIndex.current++;
            return nodes;
        }
        mentionsMe.current = true;
        // Add text before mention
        nodes.push((0, jsx_runtime_1.jsx)("span", { children: text.substring(0, mentionIndex) }, `text:${textNodeIndex.current}`));
        textNodeIndex.current++;
        // Add mention
        nodes.push((0, jsx_runtime_1.jsx)("span", { className: mentionClassName, children: searchString }, `mention:${mentionNodeIndex.current}`));
        mentionNodeIndex.current++;
        // Add text after mention
        nodes.push((0, jsx_runtime_1.jsx)("span", { children: text.substring(mentionIndex + searchString.length) }, `text:${textNodeIndex.current}`));
        textNodeIndex.current++;
        return nodes;
    };
    const getMessageNodes = () => {
        if (!(attachments === null || attachments === void 0 ? void 0 : attachments.length)) {
            return splitTextToNodesByMention(message);
        }
        const messageNodesInternal = [];
        let startingPoint = 0;
        // Inject each attachment, pushing the string between the previous first
        attachments.forEach((attachment) => {
            // Push the text before the emoji in
            const preEmoji = message.substring(startingPoint, attachment.startIndex);
            messageNodesInternal.push(...splitTextToNodesByMention(preEmoji));
            // Inject the emoji
            messageNodesInternal.push((0, jsx_runtime_1.jsx)(ChatEmoji_1.ChatEmoji, { className: emojiClassName, emoji: attachment.label, source: attachment.source }, `emoji:${attachment.startIndex}:${attachment.endIndex}`));
            // Set the starting point to the end index and go again
            startingPoint = attachment.endIndex + 1;
        });
        // Get the remainder of the string added in there
        // if (startingPoint < message.length)
        messageNodesInternal.push(...splitTextToNodesByMention(message.substring(startingPoint)));
        return messageNodesInternal;
    };
    return { messageNodes: getMessageNodes(), mentionsMe: mentionsMe.current };
}
exports.useChatEmojisAndMentions = useChatEmojisAndMentions;
useChatEmojisAndMentions.fragments = {
    attachment: (0, client_1.gql) `
    fragment UseChatEmojisAndMentionsAttachment on ChatTextMessageAttachment {
      label
      source
      startIndex
      endIndex
    }
  `,
};
//# sourceMappingURL=useChatEmojisAndMentions.hook.js.map