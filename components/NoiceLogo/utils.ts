import LogoHorizontalSpectrumDark from './assets/logo-noice-horizontal-spectrum-dark.svg?url';
import LogoHorizontalSpectrumLight from './assets/logo-noice-horizontal-spectrum-light.svg?url';
import LogoMarkBlackFlat from './assets/logo-noice-mark-black-flat.svg?url';
import LogoMarkBlack from './assets/logo-noice-mark-black.svg?url';
import LogoMarkLightFlat from './assets/logo-noice-mark-light-flat.svg?url';
import LogoMarkLight from './assets/logo-noice-mark-light.svg?url';
import LogoMarkSpectrum from './assets/logo-noice-mark-spectrum.svg?url';
import LogoTypeDark from './assets/logo-noice-type-dark.svg?url';
import LogoTypeLight from './assets/logo-noice-type-light.svg?url';
import LogoVerticalSpectrumDark from './assets/logo-noice-vertical-spectrum-dark.svg?url';
import LogoVerticalSpectrumLight from './assets/logo-noice-vertical-spectrum-light.svg?url';
import { Props } from './NoiceLogo.types';

export function getLogoVariant({ theme, variant }: Pick<Props, 'theme' | 'variant'>) {
  switch (variant) {
    case 'horizontal':
      switch (theme) {
        case 'dark':
          return LogoHorizontalSpectrumDark;
        case 'light':
          return LogoHorizontalSpectrumLight;
      }
      break;

    case 'mark':
      switch (theme) {
        case 'black':
          return LogoMarkBlack;
        case 'black-flat':
          return LogoMarkBlackFlat;
        case 'light':
          return LogoMarkLight;
        case 'light-flat':
          return LogoMarkLightFlat;
        case 'spectrum':
          return LogoMarkSpectrum;
      }
      break;

    case 'type':
      switch (theme) {
        case 'dark':
          return LogoTypeDark;
        case 'light':
          return LogoTypeLight;
      }
      break;

    case 'vertical':
      switch (theme) {
        case 'dark':
          return LogoVerticalSpectrumDark;
        case 'light':
          return LogoVerticalSpectrumLight;
      }
      break;
  }
}
