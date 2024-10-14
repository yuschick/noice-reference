"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatWrapper = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_ui_1 = require("@noice-com/common-ui");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = require("react");
const ChatWrapper_module_css_1 = __importDefault(require("./ChatWrapper.module.css"));
function getUnreadMessagesText(unreadCount) {
    if (unreadCount === 1) {
        return '1 New message';
    }
    if (unreadCount > 1 && unreadCount <= 10) {
        return `${unreadCount} New messages`;
    }
    if (unreadCount > 10) {
        return '10+ New messages';
    }
    return 'No new messages';
}
/*
    The ChatWrapper handles scrolling to and notifying players of new messages.

    The chat window has two states:
      1. Auto - The chat window is automatically jumped to the latest message
      2. Paused - The chat window is paused and does not automatically scroll to the latest message

    When the chat state is 'auto'
    - any new message sent, by local or external players, will automatically jump the chat window to the latest message

    When the chat state is 'paused'
    - any new message sent by an external player will not scroll the chat window to the latest message and will increment the unreadMessagesCount
    - any new message sent by the local player will scroll the chat window to the latest message and reset the unreadMessagesCount

    When the unreadMessagesCount is greater than 0
    - the chat window will display a button that will jump the chat window to the latest message and reset the unreadMessagesCount
*/
function ChatWrapper({ children, className, latestMessage, 
/* eslint-disable-next-line @typescript-eslint/naming-convention */
__UNSAFE_debugMode, }) {
    var _a;
    const [chatState, setChatState] = (0, react_1.useState)('auto');
    const [chatVisibility, setChatVisibility] = (0, react_1.useState)('visible');
    const [unreadMessagesCount, setUnreadMessagesCount] = (0, react_1.useState)(0);
    const chatWindowRef = (0, react_1.useRef)(null);
    const latestMessageElRef = (0, react_1.useRef)(null);
    const firstUnreadMessageElRef = (0, react_1.useRef)(null);
    const observerRef = (0, react_1.useRef)(null);
    const timeoutDomRef = (0, react_1.useRef)(null);
    const { trackEvent } = (0, common_ui_1.useAnalytics)();
    const resetChatWrapper = () => {
        var _a;
        (_a = chatWindowRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ top: chatWindowRef.current.scrollHeight });
        setChatState('auto');
        setUnreadMessagesCount(0);
        setChatVisibility('visible');
    };
    const handleNewMessagesButtonClick = () => {
        var _a;
        (_a = latestMessageElRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'instant' });
        setChatState('auto');
        setUnreadMessagesCount(0);
        // Track the click event
        trackEvent({
            clientButtonClick: { action: 'chatNewMessages' },
        });
    };
    (0, react_1.useEffect)(() => {
        if (!chatWindowRef.current) {
            return;
        }
        /**
         * There are times when the chat window itself can be hidden, such as:
         * - When the game sidebar is minimized
         * - When entering PiP mode
         *
         * In these instances, when the chat window is hidden, but then shown again,
         * we want to scroll to the bottom and reset the chat as if its brand new.
         */
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (chatVisibility !== 'visible') {
                        resetChatWrapper();
                    }
                    return;
                }
                setChatVisibility('hidden');
            });
        });
        observer.observe(chatWindowRef.current);
        return () => {
            observer.disconnect();
        };
    }, [chatVisibility]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        /**
         * If there is no latest message, or if the latest message is a duplicate, do nothing
         */
        if (!latestMessage || latestMessage.messageId === ((_a = latestMessageElRef.current) === null || _a === void 0 ? void 0 : _a.id)) {
            return;
        }
        /**
         * Get the DOM node of the latest message, but return if it doesn't exist (for some reason)
         */
        const latestMessageEl = document.getElementById(latestMessage.messageId);
        if (!latestMessageEl) {
            return;
        }
        /**
         * Set the latest message element to the ref
         * If the chat state is auto, we scroll the latest message element into view
         * If the latest message is our own, scroll it into view and reset the chat to auto
         */
        latestMessageElRef.current = latestMessageEl;
        if (chatState === 'auto' || latestMessage.sentByLocalPlayer) {
            latestMessageEl === null || latestMessageEl === void 0 ? void 0 : latestMessageEl.scrollIntoView({ behavior: 'instant' });
            /**
             * If the message is sent by the local player, reset the chat state to auto and reset the unread messages count
             */
            if (chatState === 'paused') {
                setChatState('auto');
                setUnreadMessagesCount(0);
            }
            /**
             * If the message is sent by the local player, remove the new message attribute from the first unread message
             */
            if (latestMessage.sentByLocalPlayer && firstUnreadMessageElRef.current) {
                firstUnreadMessageElRef.current.removeAttribute('data-chat');
                firstUnreadMessageElRef.current = null;
            }
        }
        /**
         * If the chat is paused and a new external player message comes in, add it to the unread messages count
         */
        if (chatState === 'paused') {
            setUnreadMessagesCount((prev) => prev + 1);
            if (!firstUnreadMessageElRef.current && !latestMessage.sentByLocalPlayer) {
                firstUnreadMessageElRef.current = latestMessageEl;
                firstUnreadMessageElRef.current.setAttribute('data-chat', 'first-unread-message');
            }
        }
        /**
         * Disconnect and remove any existing intersection observers
         * Assign an intersection observer to the latestMessageEl
         *
         * If the latest message el is within the buffer range of the view
         * - the chat state and unread messages count are reset to 'auto' and 0 respectively
         *
         * If the latest message el is outside the buffer range of the view
         * - the chat is paused and we begin collecting new message counts
         */
        (_b = observerRef.current) === null || _b === void 0 ? void 0 : _b.disconnect();
        observerRef.current = null;
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setChatState('auto');
                    setUnreadMessagesCount(0);
                    /**
                     * Set timeout to show the New Message indicator line
                     */
                    if (firstUnreadMessageElRef.current) {
                        setTimeout(() => {
                            var _a;
                            (_a = firstUnreadMessageElRef.current) === null || _a === void 0 ? void 0 : _a.removeAttribute('data-chat');
                            firstUnreadMessageElRef.current = null;
                            if (timeoutDomRef.current) {
                                timeoutDomRef.current.innerText = 'Inactive';
                            }
                        }, 4000);
                        if (timeoutDomRef.current) {
                            timeoutDomRef.current.innerText = 'Active';
                        }
                    }
                    return;
                }
                setChatState('paused');
            });
        }, {
            root: chatWindowRef.current,
            rootMargin: '40px',
            threshold: 0.5,
        });
        observerRef.current.observe(latestMessageEl);
    }, [chatState, latestMessage, unreadMessagesCount]);
    (0, react_1.useLayoutEffect)(() => {
        var _a;
        /**
         * Whenever the chat changes size, like when going in and out of theatre mode,
         * we want to scroll to the latest message in auto mode only
         */
        if (chatState === 'auto') {
            (_a = latestMessageElRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'instant' });
        }
    }, [chatState]);
    (0, common_ui_1.useMountEffect)(() => {
        resetChatWrapper();
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { "aria-label": "Chat window", className: (0, classnames_1.default)(ChatWrapper_module_css_1.default.chatContainer, className), ref: chatWindowRef, role: "region", children: [children, (0, jsx_runtime_1.jsx)(common_ui_1.MountTransition, { duration: "--noi-duration-quick", isShown: chatState === 'paused' && !!unreadMessagesCount, transitionClassName: ChatWrapper_module_css_1.default.intoView, children: (0, jsx_runtime_1.jsx)("div", { className: ChatWrapper_module_css_1.default.newMessagesBtnWrapper, children: (0, jsx_runtime_1.jsx)(common_ui_1.Button, { iconStart: common_ui_1.CommonAssets.Icons.ChevronDown, size: "sm", onClick: handleNewMessagesButtonClick, children: getUnreadMessagesText(unreadMessagesCount) }) }) })] }), __UNSAFE_debugMode && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    display: 'grid',
                    fontSize: 'var(--noi-font-size-sm)',
                    padding: '1rem',
                }, children: [(0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "State:" }), " ", chatState] }), (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Unread:" }), " ", unreadMessagesCount] }), (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "New Indicator Timeout:" }), ' ', (0, jsx_runtime_1.jsx)("span", { ref: timeoutDomRef, children: "Inactive" })] }), (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Latest ID:" }), " ", latestMessage === null || latestMessage === void 0 ? void 0 : latestMessage.messageId] }), (0, jsx_runtime_1.jsxs)("span", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "First Unread ID:" }), " ", (_a = firstUnreadMessageElRef.current) === null || _a === void 0 ? void 0 : _a.id] })] }))] }));
}
exports.ChatWrapper = ChatWrapper;
//# sourceMappingURL=ChatWrapper.js.map