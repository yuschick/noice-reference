"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const PartialEmojiMatches_1 = require("./PartialEmojiMatches");
exports.default = {
    title: 'Partial Emoji Matches',
    component: PartialEmojiMatches_1.PartialEmojiMatches,
};
const Template = (_a) => {
    var args = __rest(_a, []);
    return ((0, jsx_runtime_1.jsx)("div", { style: { width: '250px' }, children: (0, jsx_runtime_1.jsx)(PartialEmojiMatches_1.PartialEmojiMatches, Object.assign({}, args)) }));
};
exports.Default = {
    render: Template,
    args: {
        showDrawer: true,
        emojiMatches: ['emoji-dogjam', 'emoji-catjam'],
        partialText: 'jam',
        emojiList: {
            'emoji-catjam': {
                itemId: 'emoji-catjam',
                label: ':catJAM:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_catjam.gif',
            },
            'emoji-dogjam': {
                itemId: 'emoji-dogjam',
                label: ':dogJAM:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_dogjam.gif',
            },
            'emoji-kappa': {
                itemId: 'emoji-kappa',
                label: ':kappa:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_kappa.png',
            },
            'emoji-kekw': {
                itemId: 'emoji-kekw',
                label: ':KEKW:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_kekw.png',
            },
            'emoji-lul': {
                itemId: 'emoji-lul',
                label: ':LUL:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_lul.png',
            },
            'emoji-noice': {
                itemId: 'emoji-noice',
                label: ':noice:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_noice.png',
            },
            'emoji-notlikethis': {
                itemId: 'emoji-notlikethis',
                label: ':notlikethis:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_notlikethis.png',
            },
            'emoji-salty': {
                itemId: 'emoji-salty',
                label: ':salty:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_salty.png',
            },
            'emoji-seemsgood': {
                itemId: 'emoji-seemsgood',
                label: ':seemsgood:',
                source: 'https://client-assets-cdn.gcp.dev.noice.com/emotes/noice/emotes_seemsgood.png',
            },
        },
    },
};
//# sourceMappingURL=PartialEmojiMatches.stories.js.map