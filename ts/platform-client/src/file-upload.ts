import { IClient, IFileUploadService, IRequestParamsProvider, SubService } from './types';

interface ExtendedClient extends IClient, IRequestParamsProvider {}

export class FileUploadService extends SubService implements IFileUploadService {
  private _client: ExtendedClient;

  constructor(client: ExtendedClient) {
    super(client);
    this._client = client;
  }

  public async uploadFile(uploadToken: string, file: File) {
    const path = '/v1/files';
    const init = await this._client.getInitReq();

    const url = `${init.pathPrefix}${path}`;

    const headers = {
      'X-Noice-Upload-Token': uploadToken,
      ...init.headers,
    };

    const fd = new FormData();
    fd.append('myFile', file);

    // @todo error handling
    const response = await fetch(url, {
      ...init,
      method: 'POST',
      headers,
      body: fd,
    });

    const json = await response.json();

    if (!response.ok) {
      throw json;
    }

    return json.url as string;
  }
}
