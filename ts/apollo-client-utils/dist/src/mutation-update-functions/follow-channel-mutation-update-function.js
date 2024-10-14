"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followChannelMutationUpdateFunction = void 0;
const client_1 = require("@apollo/client");
const followChannelMutationUpdateFunction = (cache, _result, { variables }) => {
    if (!variables) {
        return;
    }
    cache.updateFragment({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
        fragment: (0, client_1.gql) `
        fragment FollowChannelChannel on ChannelChannel {
          id
          followerCount
          following
        }
      `,
    }, (existing) => (Object.assign(Object.assign({}, existing), { id: variables.channelId, followerCount: existing.followerCount + 1, following: true })));
};
exports.followChannelMutationUpdateFunction = followChannelMutationUpdateFunction;
//# sourceMappingURL=follow-channel-mutation-update-function.js.map