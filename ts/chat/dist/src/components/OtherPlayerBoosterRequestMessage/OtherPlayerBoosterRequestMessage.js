"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherPlayerBoosterRequestMessage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const OtherPlayerBoosterRequestMessage_module_css_1 = __importDefault(require("./OtherPlayerBoosterRequestMessage.module.css"));
function OtherPlayerBoosterRequestMessage({ profile }) {
    const { userTag } = profile;
    return ((0, jsx_runtime_1.jsxs)("div", { className: OtherPlayerBoosterRequestMessage_module_css_1.default.boosterRequestMessageWrapper, children: [(0, jsx_runtime_1.jsx)(common_ui_1.ProfileImage, { profile: profile, size: "xs" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: OtherPlayerBoosterRequestMessage_module_css_1.default.boosterRequestMessageName, children: userTag }), " requested your booster!"] })] }));
}
exports.OtherPlayerBoosterRequestMessage = OtherPlayerBoosterRequestMessage;
OtherPlayerBoosterRequestMessage.fragments = {
    entry: (0, client_1.gql) `
    fragment OtherPlayerBoosterProfile on ProfileProfile {
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageProfile
    }
  `,
};
//# sourceMappingURL=OtherPlayerBoosterRequestMessage.js.map