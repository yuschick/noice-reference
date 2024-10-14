import { ArenaConfigRenderSettings } from '@noice-com/schemas/rendering/config.pb';
import { Camera, Light, Transform } from '@noice-com/schemas/rendering/rendering.pb';

export interface Arena {
  name: string;

  cameras: Camera[];
  lights: Light[];

  renderSettings: ArenaConfigRenderSettings;
  ingestTransforms?: Transform[];
}
