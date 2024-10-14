"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAvatarMovements = void 0;
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const react_1 = require("react");
const _chat_gen_1 = require("@chat-gen");
(0, client_1.gql) `
  query AvatarMovements($userId: ID) {
    inventory(userId: $userId, filters: { itemType: TYPE_EMOTE }) {
      items {
        itemId
        item {
          id
          details {
            ... on AvatarAnimation {
              ...EmoteAvatarAnimation
            }
          }
        }
      }
    }
  }
  fragment EmoteAvatarAnimation on AvatarAnimation {
    name
    chatCommand
    iconUrl
    id
  }
`;
function useAvatarMovements() {
    var _a;
    const client = (0, common_ui_1.useClient)();
    const { userId } = (0, common_ui_1.useAuthenticatedUser)();
    const { refetch: refetchAvatarEmotes, loading, data, } = (0, _chat_gen_1.useAvatarMovementsQuery)({
        variables: {
            userId,
        },
    });
    (0, react_1.useEffect)(() => {
        return client.NotificationService.notifications({
            onInventoryUpdate: () => refetchAvatarEmotes(),
        });
    }, [client, refetchAvatarEmotes]);
    const movements = ((_a = data === null || data === void 0 ? void 0 : data.inventory) === null || _a === void 0 ? void 0 : _a.items)
        ? data.inventory.items
            .map(({ item }) => item.details)
            .filter((item) => (item === null || item === void 0 ? void 0 : item.__typename) === 'AvatarAnimation')
        : [];
    return {
        movements,
        loading,
    };
}
exports.useAvatarMovements = useAvatarMovements;
//# sourceMappingURL=useAvatarMovements.hook.js.map