/* eslint-disable @typescript-eslint/no-explicit-any */
import { proxy, wrap } from 'comlink';

export class XAtlasWebWorker {
  public api: any;

  public init(
    onLoad: () => void,
    onProgress: (mode: any, progress: any) => void,
    wasmFilePath: string,
    workerFilePath?: string,
  ): void {
    if (this.api) {
      return;
    }

    if (!workerFilePath) {
      throw new Error('workerFilePath is required');
    }

    (async () => {
      const workerCode = await fetch(workerFilePath).then((res) => res.blob());
      const workerUrl = URL.createObjectURL(workerCode);
      const worker = new Worker(workerUrl, { type: 'module' });

      // @ts-ignore
      this.api = await new (wrap(worker))(
        proxy(() => {
          onLoad();
          URL.revokeObjectURL(workerUrl);
        }),
        proxy((path: string, dir: string) => {
          return path === 'xatlas_web.wasm' ? wasmFilePath : path + dir;
        }),
        proxy(onProgress),
      );
    })();
  }
}
