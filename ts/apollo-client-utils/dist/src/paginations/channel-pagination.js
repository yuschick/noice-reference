"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelPagination = void 0;
const client_1 = require("@apollo/client");
const gen_1 = require("../../gen");
const changedLiveStatus = (oldLiveStatus) => {
    if (oldLiveStatus === gen_1.ChannelLiveStatus.LiveStatusOffline) {
        return gen_1.ChannelLiveStatus.LiveStatusLive;
    }
    if (oldLiveStatus === gen_1.ChannelLiveStatus.LiveStatusLive) {
        return gen_1.ChannelLiveStatus.LiveStatusOffline;
    }
    return oldLiveStatus;
};
const updateRemovedChannelLiveStatus = (removedChannelIds, cache, liveStatusArg) => {
    removedChannelIds.forEach((channelId) => {
        cache.updateFragment({
            id: cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
            fragment: (0, client_1.gql) `
          fragment LiveStatusChangedChannelUpdate on ChannelChannel {
            liveStatus
          }
        `,
        }, (existingChannel) => (Object.assign(Object.assign({}, existingChannel), { liveStatus: changedLiveStatus(liveStatusArg) })));
    });
};
function channelPagination() {
    return {
        keyArgs: ['liveStatus', 'name', 'gameId'],
        read(existing) {
            if (existing) {
                return Object.assign(Object.assign({}, existing), { channels: Object.values(existing.channels) });
            }
        },
        merge(existing, incoming, { readField, args, cache }) {
            var _a, _b, _c;
            if (!incoming) {
                return existing !== null && existing !== void 0 ? existing : null;
            }
            let channels = {};
            // If there is existing and cursor is present, we are paginating, so include existing
            if (existing && (((_a = args === null || args === void 0 ? void 0 : args.cursor) === null || _a === void 0 ? void 0 : _a.after) || ((_b = args === null || args === void 0 ? void 0 : args.cursor) === null || _b === void 0 ? void 0 : _b.before))) {
                channels = Object.assign({}, existing.channels);
            }
            // If we are not paginating, but we have live status argument, we know that channels
            // that are in existing but not incoming have changed live status,
            // so lets update existing channels live status
            else if (existing &&
                ((_c = args === null || args === void 0 ? void 0 : args.cursor) === null || _c === void 0 ? void 0 : _c.first) &&
                incoming.channels.length < args.cursor.first &&
                (args === null || args === void 0 ? void 0 : args.liveStatus) &&
                [gen_1.ChannelLiveStatus.LiveStatusLive, gen_1.ChannelLiveStatus.LiveStatusOffline].includes(args.liveStatus)) {
                const ingomingChannelsIds = incoming.channels.map((channel) => readField('id', channel));
                // Get all channels that were in existing but not incoming
                const changedLiveStatusChannels = Object.keys(existing.channels).filter((channeldId) => !ingomingChannelsIds.includes(channeldId));
                updateRemovedChannelLiveStatus(changedLiveStatusChannels, cache, args.liveStatus);
            }
            incoming.channels.forEach((channel) => {
                channels[readField('id', channel)] = channel;
            });
            return Object.assign(Object.assign({}, incoming), { channels });
        },
    };
}
exports.channelPagination = channelPagination;
//# sourceMappingURL=channel-pagination.js.map