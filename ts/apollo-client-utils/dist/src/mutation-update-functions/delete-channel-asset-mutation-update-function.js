"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChannelAssetMutationUpdateFunction = void 0;
const client_1 = require("@apollo/client");
const gen_1 = require("../../gen");
const deleteChannelAssetMutationUpdateFunction = (cache, _result, { variables }) => {
    if ((variables === null || variables === void 0 ? void 0 : variables.assetType) === gen_1.ChannelAssetType.AssetTypeLogo) {
        cache.updateFragment({
            id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
            fragment: (0, client_1.gql) `
          fragment LogoUpdateChannelChannel on ChannelChannel {
            id
            logo
          }
        `,
        }, (data) => (Object.assign(Object.assign({}, data), { logo: '' })));
    }
    if ((variables === null || variables === void 0 ? void 0 : variables.assetType) === gen_1.ChannelAssetType.AssetTypeBanner) {
        cache.updateFragment({
            id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
            fragment: (0, client_1.gql) `
          fragment BannerUpdateChannelChannel on ChannelChannel {
            id
            offlineBanner
          }
        `,
        }, (data) => (Object.assign(Object.assign({}, data), { offlineBanner: '' })));
    }
};
exports.deleteChannelAssetMutationUpdateFunction = deleteChannelAssetMutationUpdateFunction;
//# sourceMappingURL=delete-channel-asset-mutation-update-function.js.map