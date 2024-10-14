import { LocalPlayerBoosterRequestProfileFragment, OtherPlayerBoosterProfileFragment } from '@chat-gen';
export declare enum ChatBoosterRequestType {
    LOCAL = "local",
    OTHER = "other"
}
export interface LocalPlayerBoosterRequest {
    profile: LocalPlayerBoosterRequestProfileFragment;
    id: string;
}
export interface OtherPlayerBoosterRequest {
    profile: OtherPlayerBoosterProfileFragment;
    id: string;
}
export type ChatBoosterRequest = {
    id: string;
    time: Date;
    type: ChatBoosterRequestType.LOCAL;
    content: LocalPlayerBoosterRequest;
} | {
    id: string;
    time: Date;
    type: ChatBoosterRequestType.OTHER;
    content: OtherPlayerBoosterRequest;
};
