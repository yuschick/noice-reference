"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBoosterRequests = void 0;
const client_1 = require("@apollo/client");
const common_ui_1 = require("@noice-com/common-ui");
const react_1 = require("react");
const uuid_1 = require("uuid");
const _chat_gen_1 = require("@chat-gen");
const _chat_types_1 = require("@chat-types");
const getBoosterMessageId = (type, otherPlayerId) => {
    if (type === _chat_types_1.ChatBoosterRequestType.LOCAL) {
        return `local-player-request-${otherPlayerId}`;
    }
    return `other-player-request-${otherPlayerId}`;
};
(0, client_1.gql) `
  query OtherBoosterRequestOtherProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...OtherPlayerBoosterProfile
    }
  }
`;
(0, client_1.gql) `
  query LocalBoosterRequestOtherProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...LocalPlayerBoosterRequestProfile
    }
  }
`;
function useBoosterRequests() {
    const [boosterRequests, setBoosterRequests] = (0, react_1.useState)([]);
    const { userId } = (0, common_ui_1.useAuthenticatedUser)();
    const [fetchOtherRequestProfile] = (0, _chat_gen_1.useOtherBoosterRequestOtherProfileLazyQuery)();
    const [fetchLocalRequestProfile] = (0, _chat_gen_1.useLocalBoosterRequestOtherProfileLazyQuery)();
    const addBoosterRequest = (0, react_1.useCallback)((targetUserId, requestUserId) => __awaiter(this, void 0, void 0, function* () {
        if (userId === targetUserId) {
            const { data } = yield fetchOtherRequestProfile({
                variables: { userId: requestUserId },
            });
            const profile = data === null || data === void 0 ? void 0 : data.profile;
            if (!profile) {
                return;
            }
            setBoosterRequests((prev) => [
                ...prev,
                {
                    type: _chat_types_1.ChatBoosterRequestType.OTHER,
                    time: new Date(),
                    id: (0, uuid_1.v4)(),
                    content: {
                        profile,
                        id: getBoosterMessageId(_chat_types_1.ChatBoosterRequestType.OTHER, requestUserId),
                    },
                },
            ]);
            return;
        }
        if (userId === requestUserId) {
            const { data } = yield fetchLocalRequestProfile({
                variables: { userId: targetUserId },
            });
            const profile = data === null || data === void 0 ? void 0 : data.profile;
            if (!profile) {
                return;
            }
            setBoosterRequests((prev) => [
                ...prev,
                {
                    type: _chat_types_1.ChatBoosterRequestType.LOCAL,
                    time: new Date(),
                    id: (0, uuid_1.v4)(),
                    content: {
                        profile,
                        id: getBoosterMessageId(_chat_types_1.ChatBoosterRequestType.LOCAL, targetUserId),
                    },
                },
            ]);
        }
    }), [fetchLocalRequestProfile, fetchOtherRequestProfile, userId]);
    const removeBoosterRequest = (0, react_1.useCallback)((targetUserId, requestUserId) => {
        let idToRemove = '';
        if (userId === targetUserId) {
            idToRemove = getBoosterMessageId(_chat_types_1.ChatBoosterRequestType.OTHER, requestUserId);
        }
        if (userId === requestUserId) {
            idToRemove = getBoosterMessageId(_chat_types_1.ChatBoosterRequestType.LOCAL, targetUserId);
        }
        if (!idToRemove) {
            return;
        }
        setBoosterRequests((prev) => {
            // find the latest message with the same message id
            const lastRequestWithType = prev
                .reverse()
                .find((m) => m.content.id === idToRemove);
            if (!lastRequestWithType) {
                return prev;
            }
            // filter the message out from the list
            return prev.filter((message) => {
                return message.id !== lastRequestWithType.id;
            });
        });
    }, [userId]);
    const clearAllBoosterRequests = (0, react_1.useCallback)(() => {
        setBoosterRequests([]);
    }, []);
    return {
        boosterRequests,
        addBoosterRequest,
        removeBoosterRequest,
        clearAllBoosterRequests,
    };
}
exports.useBoosterRequests = useBoosterRequests;
//# sourceMappingURL=useBoosterRequests.hook.js.map