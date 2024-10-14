"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPagination = void 0;
function searchPagination() {
    return {
        keyArgs: ['query'],
        read(existing) {
            return existing;
        },
        merge(existing, incoming) {
            var _a;
            if (!incoming) {
                return existing || null;
            }
            // Filter the existing items
            const newResultItems = incoming.resultItems.filter((incomingItem) => !(existing === null || existing === void 0 ? void 0 : existing.resultItems.some((existingItem) => existingItem.entityId === incomingItem.entityId)));
            return Object.assign(Object.assign({}, existing), { resultItems: [...((_a = existing === null || existing === void 0 ? void 0 : existing.resultItems) !== null && _a !== void 0 ? _a : []), ...newResultItems], pageInfo: incoming.pageInfo });
        },
    };
}
exports.searchPagination = searchPagination;
//# sourceMappingURL=search-pagination.js.map