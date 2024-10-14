import { Animation, AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Graphics } from '../../graphics';

import { AnimatedAvatar } from './animated-avatar';
import { AvatarViewer, AvatarViewerProps } from './avatar-viewer';

import { AnimationPoolV2 } from '@legacy/entities';
import { disposeObject } from '@legacy/helpers/mesh';

const loader = new GLTFLoader();

export class AvatarViewerFromUrl extends AvatarViewer {
  public onLoadingHandler?: (loading: boolean) => void;
  public onLoadingProgressHandler?: (url: string, loaded: number, total: number) => void;

  private _loadingAvatar = false;
  private _avatars: Map<string, AnimatedAvatar>;
  private _animationPool: AnimationPoolV2;

  constructor(
    graphics: Graphics,
    animations: Animation[],
    props: AvatarViewerProps = {
      loadBackgroundMesh: true,
      loadShadowCatcher: true,
      applyShoeOffset: false,
      setCameraYForDistance: false,
    },
  ) {
    super(graphics, props);

    this._avatars = new Map();

    this._animationPool = new AnimationPoolV2(animations);
    this._animationPool.loadAnimationsByCategory(AnimationCategory.CATEGORY_IDLE);
  }

  public get loadingAvatar(): boolean {
    return this._loadingAvatar;
  }

  public setAvatarFromUrl(
    url: string,
    onCompleted?: () => void,
    initialAnimation: AnimationCategory = AnimationCategory.CATEGORY_IDLE,
    dispose = true,
  ) {
    this._loadingAvatar = true;

    if (!this._avatars.has(url)) {
      this.onLoadingHandler?.(true);

      loader.load(
        url,
        (data) => {
          this.onLoadingHandler?.(false);

          const avatar = new AnimatedAvatar(
            this._animationPool,
            AnimationCategory.CATEGORY_IDLE,
          );
          avatar.setAnimationObject(data.scene);

          this.setAvatar(avatar, dispose);

          if (initialAnimation) {
            avatar.triggerAnimationByCategory(initialAnimation);
          }

          this._avatars.set(url, avatar);

          onCompleted?.();
          this._loadingAvatar = false;
        },
        (event) => this.onLoadingProgressHandler?.(url, event.loaded, event.total),
      );

      return;
    }

    const avatar = this._avatars.get(url);
    this.setAvatar(avatar, false);

    if (initialAnimation) {
      avatar?.triggerAnimationByCategory(initialAnimation);
    }

    onCompleted?.();
    this._loadingAvatar = false;
  }

  public destruct(): void {
    super.destruct();

    for (const avatar of this._avatars.values()) {
      disposeObject(avatar);
    }
  }
}
