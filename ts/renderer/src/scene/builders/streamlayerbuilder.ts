import { Layer } from 'scene/layer';
import { Scene } from 'scene/scene';

export class StreamLayerBuilder {
  public async getLayer(_scene: Scene): Promise<Layer> {
    const layer = new Layer();
    layer.name = 'Stream';
    return layer;
  }
}
