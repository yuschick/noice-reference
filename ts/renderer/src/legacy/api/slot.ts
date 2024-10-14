import { Transform } from '@noice-com/schemas/rendering/rendering.pb';

export interface Slot {
  id: number;

  transform: Transform;
}
