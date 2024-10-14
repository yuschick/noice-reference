"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChannelBansPagination = void 0;
function userChannelBansPagination() {
    return {
        keyArgs: ['userId'],
        read(existing) {
            if (existing) {
                return Object.assign(Object.assign({}, existing), { bans: Object.values(existing.bans) });
            }
        },
        merge(existing, incoming, { readField }) {
            if (!incoming) {
                return existing || null;
            }
            const bans = existing ? Object.assign({}, existing.bans) : {};
            incoming.bans.forEach((ban) => {
                bans[readField('channelId', ban)] = ban;
            });
            return Object.assign(Object.assign({}, incoming), { bans });
        },
    };
}
exports.userChannelBansPagination = userChannelBansPagination;
//# sourceMappingURL=user-channel-bans-pagination.js.map