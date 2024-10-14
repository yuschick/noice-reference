"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelPrivilegedUsersPagination = void 0;
function channelPrivilegedUsersPagination() {
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
exports.channelPrivilegedUsersPagination = channelPrivilegedUsersPagination;
//# sourceMappingURL=channel-priviledged-users-pagination.js.map