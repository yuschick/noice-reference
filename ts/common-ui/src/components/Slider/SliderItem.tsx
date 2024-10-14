import { useContext } from 'react';

import { SliderContext } from './SliderProvider';

import { WithChildren } from '@common-types';

export function SliderItem({ children }: WithChildren) {
  const context = useContext(SliderContext);

  if (!context) {
    throw new Error('Slider.Item can only be used within a Slider.');
  }

  return <>{children}</>;
}
