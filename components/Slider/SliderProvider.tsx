import { createContext } from 'react';

import { UseSliderResult } from './useSlider.hook';

import { WithChildren } from '@common-types';

interface Props extends WithChildren {
  store: UseSliderResult;
}

export const SliderContext = createContext<UseSliderResult | undefined>(undefined);

const SliderProvider = ({ children, store }: Props) => {
  return <SliderContext.Provider value={store}>{children}</SliderContext.Provider>;
};

export { SliderProvider };
