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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatAPIInternal = exports.useChatAPI = exports.ChatAPIProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const react_1 = require("react");
const useBoosterRequests_hook_1 = require("./hooks/useBoosterRequests.hook");
const ChatAPIContext = (0, react_1.createContext)(null);
const events = new eventemitter3_1.default();
const addListener = events.addListener.bind(events);
const removeListener = events.removeListener.bind(events);
const listeners = {
    addListener,
    removeListener,
};
function ChatAPIProvider({ children }) {
    const { boosterRequests, addBoosterRequest, removeBoosterRequest, clearAllBoosterRequests, } = (0, useBoosterRequests_hook_1.useBoosterRequests)();
    return ((0, jsx_runtime_1.jsx)(ChatAPIContext.Provider, { value: {
            addBoosterRequest,
            removeBoosterRequest,
            boosterRequests,
            clearAllBoosterRequests,
        }, children: children }));
}
exports.ChatAPIProvider = ChatAPIProvider;
function useChatAPI() {
    const context = (0, react_1.useContext)(ChatAPIContext);
    if (!context) {
        throw new Error('Trying to access chat context without ChatAPIProvider');
    }
    return Object.assign({ events: listeners }, context);
}
exports.useChatAPI = useChatAPI;
function useChatAPIInternal() {
    const context = (0, react_1.useContext)(ChatAPIContext);
    // Make a version of emit that can be awaited until listener callbacks are done
    const emitAPIEvent = (0, react_1.useCallback)((event, ...args) => __awaiter(this, void 0, void 0, function* () {
        const promises = events.listeners(event);
        yield Promise.all(promises.map((fn) => fn(...args)));
    }), []);
    // Since API is optional, we don't want to throw an error if it's not provided.
    if (!context) {
        return {
            emitAPIEvent,
            boosterRequests: [],
        };
    }
    return Object.assign({ emitAPIEvent }, context);
}
exports.useChatAPIInternal = useChatAPIInternal;
//# sourceMappingURL=ChatAPIProvider.js.map