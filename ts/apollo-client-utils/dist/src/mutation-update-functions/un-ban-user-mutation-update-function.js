"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unBanUserMutationUpdateFunction = void 0;
const unBanUserMutationUpdateFunction = (cache, _result, { variables }) => {
    cache.modify({
        fields: {
            channelBannedUsers(existingBannedUser = { users: {} }) {
                if (!(variables === null || variables === void 0 ? void 0 : variables.userId)) {
                    return existingBannedUser;
                }
                const users = existingBannedUser.users;
                delete users[variables === null || variables === void 0 ? void 0 : variables.userId];
                return { users };
            },
        },
    });
};
exports.unBanUserMutationUpdateFunction = unBanUserMutationUpdateFunction;
//# sourceMappingURL=un-ban-user-mutation-update-function.js.map