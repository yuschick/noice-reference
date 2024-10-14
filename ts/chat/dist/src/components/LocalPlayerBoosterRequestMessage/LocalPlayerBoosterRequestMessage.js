"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPlayerBoosterRequestMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const LocalPlayerBoosterRequestMessage_module_css_1 = __importDefault(require("./LocalPlayerBoosterRequestMessage.module.css"));
function LocalPlayerBoosterRequestMessage({ profile }) {
    const { userTag } = profile;
    return ((0, jsx_runtime_1.jsx)("div", { className: LocalPlayerBoosterRequestMessage_module_css_1.default.boosterRequestMessageWrapper, children: (0, jsx_runtime_1.jsxs)("div", { children: ["You requested", ' ', (0, jsx_runtime_1.jsxs)("span", { className: LocalPlayerBoosterRequestMessage_module_css_1.default.boosterRequestMessageName, children: [userTag, "'s"] }), ' ', "booster!"] }) }));
}
exports.LocalPlayerBoosterRequestMessage = LocalPlayerBoosterRequestMessage;
LocalPlayerBoosterRequestMessage.fragments = {
    entry: (0, client_1.gql) `
    fragment LocalPlayerBoosterRequestProfile on ProfileProfile {
      userTag
    }
  `,
};
//# sourceMappingURL=LocalPlayerBoosterRequestMessage.js.map