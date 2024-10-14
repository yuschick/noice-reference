import { Nullable } from '@noice-com/utils';
import { OverlayRenderer } from '@noice-com/web-renderer/src/renderer';

export class OverlayController {
  private _renderer: OverlayRenderer;
  private _disposed = false;

  constructor(container: HTMLElement) {
    const renderer = new OverlayRenderer(container);
    this._renderer = renderer;
    this._render();
  }

  private _render(): void {
    if (this._disposed) {
      return;
    }

    this._renderer.render();

    requestAnimationFrame(() => this._render());
  }

  public async addVideo(mediaStream: Nullable<MediaStream>): Promise<void> {
    await this._renderer.addVideo(mediaStream);
  }

  public resize(width: number, height: number, devicePixelRatio: number): void {
    return this._renderer.resize(width, height, devicePixelRatio);
  }

  public async dispose(): Promise<void> {
    await this._renderer.dispose();
  }
}
