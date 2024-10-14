import * as THREE from 'three';

import { Emoji, EmojiV1, EmojiV2 } from '@legacy/entities/emoji';

export class EmojiController {
  private _avatar: THREE.Object3D;
  private _emojis: Set<Emoji>;

  public constructor(avatar: THREE.Object3D) {
    this._avatar = avatar;
    this._emojis = new Set();
  }

  public destruct(): void {
    for (const emoji of this._emojis) {
      emoji.destruct();
    }
  }

  public async emitEmoji(name: string, url: string, version?: number): Promise<void> {
    const emoji =
      version === 2 ? new EmojiV2(name, url, 1.5) : new EmojiV1(name, url, 1.5);

    emoji.visible = true;

    emoji.position.set(0.0, 1.7, 0.25);
    emoji.scale.set(0.25, 0.25, 1.0);

    emoji.renderOrder = 999999;
    emoji.emit();

    this._emojis.add(emoji);
    this._avatar.add(emoji);
  }

  public update(): void {
    for (const emoji of this._emojis) {
      if (emoji.isLoaded === false) {
        continue;
      }

      emoji.update();

      if (emoji.isAlive === false) {
        emoji.removeFromParent();
        emoji.destruct();

        this._emojis.delete(emoji);
      }
    }
  }
}
