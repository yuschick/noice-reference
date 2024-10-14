import { useContext } from 'react';

import { Slider } from '../Slider';

import { CategoryFilterContext } from './CategoryFilterProvider';

import { WithChildren } from '@common-types';

export function CategoryFilterItem({ children }: WithChildren) {
  const context = useContext(CategoryFilterContext);

  if (!context) {
    throw new Error('CategoryFilter.Item can only be used within a CategoryFilter.');
  }

  return <Slider.Item>{children}</Slider.Item>;
}
