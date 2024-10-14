"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelEmojisPagination = void 0;
function channelEmojisPagination() {
    return {
        keyArgs: ['channelId'],
        read(existing) {
            if (existing) {
                return existing;
            }
        },
        merge(existing, incoming, { readField }) {
            var _a, _b, _c;
            if (!incoming) {
                return existing !== null && existing !== void 0 ? existing : null;
            }
            const existingEmojiIds = new Set(existing === null || existing === void 0 ? void 0 : existing.emojis.map((emoji) => readField('id', emoji)));
            const emojis = [
                ...((_a = existing === null || existing === void 0 ? void 0 : existing.emojis) !== null && _a !== void 0 ? _a : []),
                ...((_c = (_b = incoming.emojis) === null || _b === void 0 ? void 0 : _b.filter((emoji) => !existingEmojiIds.has(readField('id', emoji)))) !== null && _c !== void 0 ? _c : []),
            ];
            return Object.assign(Object.assign({}, incoming), { emojis });
        },
    };
}
exports.channelEmojisPagination = channelEmojisPagination;
//# sourceMappingURL=channel-emojis-pagination.js.map