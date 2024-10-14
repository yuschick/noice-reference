import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';

export const qualityLayerEquals = (
  q1: Nullable<QualityLayer>,
  q2: Nullable<QualityLayer>,
): boolean => {
  return (
    q1 !== null &&
    q2 !== null &&
    q1.height === q2.height &&
    q1.width === q2.width &&
    q1.framerate === q2.framerate
  );
};
