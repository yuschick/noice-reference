import { FieldPolicy } from '@apollo/client';
import { ChatListMessagesResponse } from '../../gen';
type ChatFieldPolicy = FieldPolicy<ChatListMessagesResponse, ChatListMessagesResponse, ChatListMessagesResponse>;
export declare function chatCache(): ChatFieldPolicy;
export {};
