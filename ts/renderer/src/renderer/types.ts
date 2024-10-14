import { RendererFlags, RendererProps } from './data/types';

import { Scene } from 'scene/scene';

export interface RendererParams {
  scene: Scene;
  rendererProps: RendererProps;
  rendererFlags: RendererFlags;
}
