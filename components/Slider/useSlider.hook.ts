import { RefObject, useRef, useState } from 'react';

import { useSliderNavigation } from '@common-hooks';
import { SliderDirection } from '@common-types';

interface Props {
  title: string;
}

export interface UseSliderResult {
  actions: {
    scrollTo: (direction: SliderDirection) => void;
    setLoading: (loading: boolean) => void;
  };
  state: {
    sliderListRef: RefObject<HTMLUListElement>;
    hasOverflow: SliderDirection[];
    title: string;
  };
}

export function useSlider({ title }: Props) {
  const [loading, setLoading] = useState(true);
  const sliderListRef = useRef<HTMLUListElement>(null);

  const { hasOverflow, scrollTo } = useSliderNavigation({
    container: sliderListRef,
    options: { condition: !loading },
  });

  return {
    actions: {
      scrollTo,
      setLoading,
    },
    state: {
      sliderListRef,
      hasOverflow,
      title,
    },
  };
}
