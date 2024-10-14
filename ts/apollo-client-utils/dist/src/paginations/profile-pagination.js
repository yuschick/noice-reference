"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilePagination = void 0;
function profilePagination() {
    return {
        keyArgs: ['liveStatus'],
        read(existing) {
            if (existing) {
                return Object.assign(Object.assign({}, existing), { profiles: Object.values(existing.profiles) });
            }
        },
        merge(existing, incoming, { readField }) {
            if (!incoming) {
                return existing || null;
            }
            const profiles = existing
                ? Object.assign({}, existing.profiles) : {};
            incoming.profiles.forEach((profile) => {
                profiles[readField('userId', profile)] = profile;
            });
            return Object.assign(Object.assign({}, incoming), { profiles });
        },
    };
}
exports.profilePagination = profilePagination;
//# sourceMappingURL=profile-pagination.js.map