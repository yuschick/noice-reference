"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendsPagination = void 0;
const gen_1 = require("../../gen");
function friendsPagination() {
    return {
        keyArgs: ['userId', 'filters', 'priorityOrder'],
        read(existing) {
            if (existing) {
                return existing;
            }
        },
        merge(existing, incoming, { readField, args }) {
            var _a, _b;
            let users = [];
            // Do not merge when there is channel id
            const doNotMerge = (_b = (_a = args === null || args === void 0 ? void 0 : args.filters) === null || _a === void 0 ? void 0 : _a.some((filter) => !!filter['channelId'])) !== null && _b !== void 0 ? _b : false;
            if (!incoming) {
                if (doNotMerge) {
                    return null;
                }
                return existing !== null && existing !== void 0 ? existing : null;
            }
            if (!doNotMerge && existing) {
                users = existing.users;
            }
            const existingUserIds = new Set(users.map((user) => readField('userId', user)));
            // Merge users, but filter out duplicate users
            const mergedUsers = [
                ...users,
                ...incoming.users.filter((user) => !existingUserIds.has(readField('userId', user))),
            ].sort((a, z) => {
                const aProfile = readField('profile', a);
                const zProfile = readField('profile', z);
                const aStatus = readField('onlineStatus', aProfile);
                const zStatus = readField('onlineStatus', zProfile);
                // If they are same, they are equal
                if (aStatus === zStatus) {
                    return 0;
                }
                // If a is online, it should be first
                if (aStatus === gen_1.ProfilePresenceStatus.PresenceStatusOnline) {
                    return -1;
                }
                // If z is online, it should be first
                if (zStatus === gen_1.ProfilePresenceStatus.PresenceStatusOnline) {
                    return 1;
                }
                return 0;
            });
            return Object.assign(Object.assign({}, incoming), { users: mergedUsers });
        },
    };
}
exports.friendsPagination = friendsPagination;
//# sourceMappingURL=friends-pagination.js.map