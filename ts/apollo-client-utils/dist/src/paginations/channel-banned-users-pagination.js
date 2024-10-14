"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelBannedUsersPagination = void 0;
function channelBannedUsersPagination() {
    return {
        keyArgs: ['channelId'],
        read(existing) {
            if (existing) {
                return Object.assign(Object.assign({}, existing), { users: Object.values(existing.users) });
            }
        },
        merge(existing, incoming, { readField }) {
            if (!incoming) {
                return existing || null;
            }
            const users = existing ? Object.assign({}, existing.users) : {};
            incoming.users.forEach((user) => {
                users[readField('userId', user)] = user;
            });
            return Object.assign(Object.assign({}, incoming), { users });
        },
    };
}
exports.channelBannedUsersPagination = channelBannedUsersPagination;
//# sourceMappingURL=channel-banned-users-pagination.js.map