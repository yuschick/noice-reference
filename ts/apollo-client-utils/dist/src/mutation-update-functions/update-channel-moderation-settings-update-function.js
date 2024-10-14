"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChannelModerationSettingsUpdateFunction = void 0;
const updateChannelModerationSettingsUpdateFunction = (cache, _result, { variables }) => {
    cache.modify({
        fields: {
            channelModerationSettings(existingChannelModerationSettings) {
                var _a;
                return Object.assign(Object.assign({}, existingChannelModerationSettings), { banAppealsEnabled: (_a = variables === null || variables === void 0 ? void 0 : variables.banAppealsEnabled) !== null && _a !== void 0 ? _a : existingChannelModerationSettings.banAppealsEnabled, automod: Object.assign(Object.assign({}, existingChannelModerationSettings.automod), variables === null || variables === void 0 ? void 0 : variables.automod) });
            },
        },
    });
};
exports.updateChannelModerationSettingsUpdateFunction = updateChannelModerationSettingsUpdateFunction;
//# sourceMappingURL=update-channel-moderation-settings-update-function.js.map