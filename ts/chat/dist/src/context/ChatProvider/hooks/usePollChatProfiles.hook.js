"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePollChatProfiles = void 0;
const client_1 = require("@apollo/client");
const _chat_gen_1 = require("@chat-gen");
(0, client_1.gql) `
  query ChatProfiles($userIds: [String!]!, $channelId: ID!) {
    profileBatch(userIds: $userIds) {
      profiles {
        userId
        ...ChatMessageSenderProfile
        badges(channel_id: $channelId) {
          ...UserBadge
        }
      }
    }
  }
`;
function usePollChatProfiles({ messages, channelId }) {
    (0, _chat_gen_1.useChatProfilesQuery)({
        skip: !channelId || !messages.length,
        variables: {
            channelId: channelId,
            userIds: messages.map((message) => message.senderId),
        },
        pollInterval: 1000 * 60 * 4,
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-and-network',
    });
}
exports.usePollChatProfiles = usePollChatProfiles;
//# sourceMappingURL=usePollChatProfiles.hook.js.map