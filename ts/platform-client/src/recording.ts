import {
  RecordingProcessor,
  EncodingSettings,
  RecordingEncodingEvent,
  routeRecordingEncodingEventEventDelegate,
  RecordingEncodingEventFailed,
  RecordingEncodingEventFinished,
  RecordingEncodingEventProgress,
} from '@noice-com/schemas/stream/recording_processor.pb';

import { IRecordingService, SubService, RecordingError, EncodingDelegate } from './types';

export class RecordingService extends SubService implements IRecordingService {
  public async watchRecording(
    channelId: string,
    streamId: string,
    _offset: number,
  ): Promise<string> {
    const init = await this._getInitReq();
    const { pathPrefix } = init || {};

    const serviceUrl = `/v1/channels/${channelId}/streams/${streamId}/hls`;
    const url = pathPrefix ? `${pathPrefix}${serviceUrl}` : serviceUrl;

    const res = await fetch(url, {
      ...init,
      method: 'GET',
    });

    const body = await res.text();

    if (!res.ok) {
      throw new RecordingError(res.status, body);
    }
    return body;
  }

  public async encodeRecording(
    streamId: string,
    settings: EncodingSettings,
    delegate?: EncodingDelegate,
  ): Promise<string> {
    const initReq = await this._getInitReq();

    return new Promise((resolve, reject) => {
      const rejectOnce = (err: Error): void => {
        reject(err);
        reject = () => {};
      };

      let downloadUrl = '';

      RecordingProcessor.EncodeRecording(
        {
          streamId,
          settings,
        },
        (evt: RecordingEncodingEvent) => {
          routeRecordingEncodingEventEventDelegate(evt.encodingId || '', evt, {
            onAccepted: function (ctx: string): void {
              delegate?.onAccepted(ctx);
            },
            onStarted: function (ctx: string): void {
              delegate?.onStarted(ctx);
            },
            onFailed: function (_: string, ev: RecordingEncodingEventFailed): void {
              rejectOnce(new Error(ev.error || 'unknown error'));
            },
            onProgress: function (ctx: string, ev: RecordingEncodingEventProgress): void {
              delegate?.onProgress(ctx, ev.progress || 0);
            },
            onFinished: function (_: string, ev: RecordingEncodingEventFinished): void {
              downloadUrl = ev.videoUrl || '';
            },
          });
        },
        initReq,
      )
        .then(() => {
          resolve(downloadUrl);
          return;
        })
        .catch(rejectOnce);
    });
  }
}
