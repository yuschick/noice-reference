"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelModerationSettingsCache = void 0;
function channelModerationSettingsCache() {
    return {
        keyArgs: ['channelId'],
        read(existing) {
            return existing;
        },
        merge(existing, incoming) {
            return Object.assign(Object.assign({}, existing), incoming);
        },
    };
}
exports.channelModerationSettingsCache = channelModerationSettingsCache;
//# sourceMappingURL=channel-moderation-settings-cache.js.map