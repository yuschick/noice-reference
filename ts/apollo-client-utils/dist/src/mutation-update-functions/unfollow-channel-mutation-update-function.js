"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowChannelMutationUpdateFunction = void 0;
const client_1 = require("@apollo/client");
const unfollowChannelMutationUpdateFunction = (cache, _result, { variables }) => {
    if (!variables) {
        return;
    }
    cache.updateFragment({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id: cache.identify({ id: variables.channelId, __typename: 'ChannelChannel' }),
        fragment: (0, client_1.gql) `
        fragment UnfollowChannelChannel on ChannelChannel {
          id
          followerCount
          following
        }
      `,
    }, (existing) => (Object.assign(Object.assign({}, existing), { id: variables.channelId, followerCount: existing.followerCount - 1, following: false })));
};
exports.unfollowChannelMutationUpdateFunction = unfollowChannelMutationUpdateFunction;
//# sourceMappingURL=unfollow-channel-mutation-update-function.js.map