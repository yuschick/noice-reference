import * as ApiCursor from "../api/cursor.pb";
import * as fm from "../fetch.pb";
import * as GoogleProtobufEmpty from "../google/protobuf/empty.pb";
import * as GoogleProtobufField_mask from "../google/protobuf/field_mask.pb";
import * as ItemItem from "../item/item.pb";
export type Emoji = {
    id?: string;
    name?: string;
    label?: string;
    prefabName?: string;
    imageUrl?: string;
    channelId?: string;
    disabled?: boolean;
};
export type GetEmojiRequest = {
    id?: string;
};
export type BatchGetEmojisRequest = {
    ids?: string[];
};
export type BatchGetEmojisResponse = {
    emojis?: Emoji[];
};
export type CreateEmojiUploadTokenRequest = {
    itemId?: string;
};
export type CreateEmojiUploadTokenResponse = {
    token?: string;
};
export type CreateChannelEmojiRequest = {
    channelId?: string;
    label?: string;
};
export type UpdateChannelEmojiParams = {
    id?: string;
    channelId?: string;
    label?: string;
    disabled?: boolean;
};
export type UpdateChannelEmojiRequest = {
    body?: UpdateChannelEmojiParams;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type DeleteChannelEmojiRequest = {
    id?: string;
    channelId?: string;
};
export type ListChannelEmojisRequest = {
    channelId?: string;
    cursor?: ApiCursor.Cursor;
    includeDisabled?: boolean;
    includeCount?: boolean;
};
export type ListChannelEmojisResponse = {
    emojis?: Emoji[];
    pageInfo?: ApiCursor.PageInfo;
    count?: ItemItem.ItemTotalCount;
};
export type CreatePlatformEmojiRequest = {
    label?: string;
};
export type UpdatePlatformEmojiParams = {
    id?: string;
    label?: string;
    disabled?: boolean;
};
export type UpdatePlatformEmojiRequest = {
    body?: UpdatePlatformEmojiParams;
    updateMask?: GoogleProtobufField_mask.FieldMask;
};
export type DeletePlatformEmojiRequest = {
    id?: string;
};
export type ListPlatformEmojisRequest = {
    cursor?: ApiCursor.Cursor;
    includeDisabled?: boolean;
    includeCount?: boolean;
};
export type ListPlatformEmojisResponse = {
    emojis?: Emoji[];
    pageInfo?: ApiCursor.PageInfo;
    count?: ItemItem.ItemTotalCount;
};
export declare class EmojiService {
    static CreateEmojiUploadToken(req: CreateEmojiUploadTokenRequest, initReq?: fm.InitReq): Promise<CreateEmojiUploadTokenResponse>;
    static GetEmoji(req: GetEmojiRequest, initReq?: fm.InitReq): Promise<Emoji>;
    static BatchGetEmojis(req: BatchGetEmojisRequest, initReq?: fm.InitReq): Promise<BatchGetEmojisResponse>;
}
export declare class ChannelEmojiService {
    static CreateChannelEmoji(req: CreateChannelEmojiRequest, initReq?: fm.InitReq): Promise<Emoji>;
    static UpdateChannelEmoji(req: UpdateChannelEmojiRequest, initReq?: fm.InitReq): Promise<Emoji>;
    static DeleteChannelEmoji(req: DeleteChannelEmojiRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListChannelEmojis(req: ListChannelEmojisRequest, initReq?: fm.InitReq): Promise<ListChannelEmojisResponse>;
}
export declare class PlatformEmojiService {
    static CreatePlatformEmoji(req: CreatePlatformEmojiRequest, initReq?: fm.InitReq): Promise<Emoji>;
    static UpdatePlatformEmoji(req: UpdatePlatformEmojiRequest, initReq?: fm.InitReq): Promise<Emoji>;
    static DeletePlatformEmoji(req: DeletePlatformEmojiRequest, initReq?: fm.InitReq): Promise<GoogleProtobufEmpty.Empty>;
    static ListPlatformEmojis(req: ListPlatformEmojisRequest, initReq?: fm.InitReq): Promise<ListPlatformEmojisResponse>;
}
//# sourceMappingURL=emoji.pb.d.ts.map