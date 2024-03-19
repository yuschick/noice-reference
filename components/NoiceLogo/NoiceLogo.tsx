import { Image } from '../Image';

import { Props } from './NoiceLogo.types';
import { getLogoVariant } from './utils';

export function NoiceLogo({ color, variant, ...htmlAttributes }: Props) {
  return (
    <Image
      {...htmlAttributes}
      alt={`Noice ${variant} logo`}
      loadingType="none"
      src={getLogoVariant({ color, variant })}
    />
  );
}
