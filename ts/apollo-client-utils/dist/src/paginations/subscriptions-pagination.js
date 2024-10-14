"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsPagination = void 0;
function subscriptionsPagination() {
    return {
        keyArgs: ['filters'],
        read(existing) {
            if (existing) {
                return existing;
            }
        },
        merge(existing, incoming, { readField }) {
            var _a;
            if (!incoming) {
                return existing !== null && existing !== void 0 ? existing : null;
            }
            const existingSubscriptionIds = new Set(existing === null || existing === void 0 ? void 0 : existing.subscriptions.map((subscription) => readField('id', subscription)));
            const subscriptions = [
                ...((_a = existing === null || existing === void 0 ? void 0 : existing.subscriptions) !== null && _a !== void 0 ? _a : []),
                ...incoming.subscriptions.filter((subscription) => !existingSubscriptionIds.has(readField('id', subscription))),
            ];
            return Object.assign(Object.assign({}, incoming), { subscriptions });
        },
    };
}
exports.subscriptionsPagination = subscriptionsPagination;
//# sourceMappingURL=subscriptions-pagination.js.map