// NOTE: Unfortunately due to the Graphics API's importing three.js examples
// as ES Modules, we need to manually mock things here as trying to auto-mock
// will result in an import error.

import { Observable } from "@noice-com/utils";
// eslint-disable-next-line no-restricted-imports
import type { API } from "@noice-com/web-renderer/src/legacy";
// eslint-disable-next-line no-restricted-imports
import { CrowdAnimationRate } from "@noice-com/web-renderer/src/legacy/api";

export class Renderer {
  public registerSandbox = jest.fn();
}

export class RenderQualityObservables {
  public crowdAnimationRate = new Observable<API.CrowdAnimationRate>(CrowdAnimationRate.Full);
}

export class Graphics {
  public static Instances: Graphics[] = [];

  public constructor() {
    Graphics.Instances.push(this);
  }

  public destruct = jest.fn();
  public resize = jest.fn();
  public setDebug = jest.fn();
  public getStats = jest.fn();
  public renderQualityObservables = new RenderQualityObservables();
  public getRenderer = () => new Renderer();
}

export class Arena {
  public readonly name: string;

  private _descriptor: API.Arena;

  public constructor(_graphics: Graphics, descriptor: API.Arena) {
    this.name = descriptor.name;
    this._descriptor = descriptor;
  }

  public add = jest.fn();
  public remove = jest.fn();
  public update = jest.fn();
  public destruct = jest.fn();
  public resize = jest.fn();
  public load = jest.fn();
  public setAvatarsHidden = jest.fn();
}

export class Crowd {
  public constructor(..._args: unknown[]) {}

  public add = jest.fn();
  public remove = jest.fn();
  public update = jest.fn();
  public destruct = jest.fn();
}

export const Hierarchy = {
  Arena,
  Crowd,
}

export class AnimationPoolV2 {
  public constructor(..._args: unknown[]) {};

  public loadAnimationsByCategory = jest.fn();
}

export class PlayerV3 {
  public load = jest.fn();
  public useAnimations = jest.fn();

  public triggerAnimationById = jest.fn();
  public triggerAnimationByCategory = jest.fn();
  public triggerEmoji = jest.fn();
  public selectCard = jest.fn();
  public useBooster = jest.fn();
  public requestBooster = jest.fn();
  public removeFromParent = jest.fn();
  public destruct = jest.fn();
}
