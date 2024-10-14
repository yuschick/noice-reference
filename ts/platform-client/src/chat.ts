import {
  AutoModQueueEvent,
  ChatEvent,
  ChatModerationService as ChatModerationServicePb,
  ChatService as ChatServicePb,
  ListMessagesRequest,
  MessageContent,
  SendMessageResponse,
  routeAutoModQueueEventEventDelegate,
  routeChatEventEventDelegate,
} from '@noice-com/schemas/chat/chat.pb';

import { logger } from './lib';
import {
  IAutoModQueueDelegate,
  IChatDelegate,
  IChatService,
  IRequestParamsProvider,
  SubService,
} from './types';

const log = logger('ChatService');

export class ChatService extends SubService implements IChatService {
  constructor(parameterProvider: IRequestParamsProvider) {
    super(parameterProvider);
  }

  public async approveAutomodItem(
    chatID: string,
    moderationItemID: string,
  ): Promise<void> {
    await ChatModerationServicePb.AllowModerationItem(
      {
        chatId: chatID,
        moderationItemId: moderationItemID,
      },
      await this._getInitReq(),
    );
  }

  public async denyAutomodItem(chatID: string, moderationItemID: string): Promise<void> {
    await ChatModerationServicePb.DenyModerationItem(
      {
        chatId: chatID,
        moderationItemId: moderationItemID,
      },
      await this._getInitReq(),
    );
  }

  public async clearAutomodItem(chatID: string, moderationItemID: string): Promise<void> {
    await ChatModerationServicePb.ClearModerationItem(
      {
        chatId: chatID,
        moderationItemId: moderationItemID,
      },
      await this._getInitReq(),
    );
  }

  public async listChatMessages(req: ListMessagesRequest) {
    return ChatServicePb.ListMessages(req, await this._getInitReq());
  }

  public async sendChatMessage(
    chatID: string,
    content: MessageContent,
    moderationConsent = true,
  ): Promise<SendMessageResponse> {
    return await ChatServicePb.SendChatMessage(
      { chatId: chatID, content: content, consentToModeration: moderationConsent },
      await this._getInitReq(),
    );
  }

  public chatMessages(chatID: string, delegate: IChatDelegate): () => void {
    const abort = new AbortController();

    log.info('Starting chat messages');

    this._getInitReq()
      .then((initReq) => {
        return ChatServicePb.ChatMessageStream(
          { chatId: chatID },
          (evt: ChatEvent) => {
            routeChatEventEventDelegate(chatID, evt, delegate);
          },
          { ...initReq, signal: abort.signal },
        );
      })
      .catch((err) => {
        log.info('Error in chat messages', err.message);
        delegate.onEnd(chatID, err);
      });

    return () => {
      log.info('Aborting chat messages');
      abort.abort();
    };
  }

  public automodEvents(chatID: string, delegate: IAutoModQueueDelegate): () => void {
    const abort = new AbortController();

    this._getInitReq()
      .then((initReq) => {
        return ChatModerationServicePb.StreamAutoModQueue(
          { chatId: chatID },
          (evt: AutoModQueueEvent) => {
            routeAutoModQueueEventEventDelegate(chatID, evt, delegate);
          },
          { ...initReq, signal: abort.signal },
        );
      })
      .catch((err) => {
        delegate.onEnd(chatID, err);
      });

    return () => {
      abort.abort();
    };
  }
}
