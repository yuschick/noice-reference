"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloClient = void 0;
var create_apollo_client_1 = require("./create-apollo-client");
Object.defineProperty(exports, "createApolloClient", { enumerable: true, get: function () { return create_apollo_client_1.createApolloClient; } });
__exportStar(require("./mutation-update-functions"), exports);
__exportStar(require("./hooks"), exports);
__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map