export interface ChatInputFormProps {
    disabled?: boolean;
    sendMessage: (msg: string) => void;
    placeholder?: string;
    replyTo?: string;
    onReplyCancel: () => void;
    sendTriggerEmote?: (emoteId: string) => void;
}
export declare function ChatInputForm({ disabled, sendMessage, placeholder, replyTo, onReplyCancel, sendTriggerEmote, }: ChatInputFormProps): import("react/jsx-runtime").JSX.Element;
