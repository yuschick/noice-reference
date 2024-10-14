import {
  Article,
  CreateZendeskTokenResponse,
  GetArticleRequest,
  SupportService as SupportServicePb,
} from '@noice-com/schemas/support/support.pb';

import { ISupportService, SubService } from './types';

export class SupportService extends SubService implements ISupportService {
  public async getArticle({ id, locale }: GetArticleRequest): Promise<Article> {
    const init = await this._getInitReq();
    const article = await SupportServicePb.GetArticle(
      { id, locale: locale || 'en-us', attachmentBaseUrl: init.pathPrefix },
      init,
    );

    return article;
  }

  public async createZendeskToken(): Promise<CreateZendeskTokenResponse> {
    const init = await this._getInitReq();
    const token = await SupportServicePb.CreateZendeskToken({}, init);

    return token;
  }
}
