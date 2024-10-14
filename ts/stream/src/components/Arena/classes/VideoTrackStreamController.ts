import { Nullable } from '@noice-com/utils';
import { Renderer } from '@noice-com/web-renderer';

export class VideoTrackStreamController {
  private _renderer: Renderer;
  private _streamReaderAbortController: Nullable<AbortController> = null;

  constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  public setVideoTrackStream(
    readerableStream: ReadableStream<VideoFrame>,
    onUpdateVideoFrame: () => void,
  ) {
    if (this._streamReaderAbortController) {
      this._streamReaderAbortController.abort();
    }

    const abortController = (this._streamReaderAbortController = new AbortController());

    (async () => {
      const reader = readerableStream.getReader();
      while (!abortController.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) {
          return;
        }

        this._renderer.updateVideoFrame(value);
        onUpdateVideoFrame();
      }
    })();
  }
}
