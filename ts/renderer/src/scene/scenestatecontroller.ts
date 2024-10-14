import { Scene } from './scene';

export abstract class SceneStateController {
  public abstract update(scene: Scene, deltaTime: number): void;
}
