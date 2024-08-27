import { CoreAssets } from '@noice-com/assets-core';
import { Children, useEffect, useId } from 'react';

import { IconButton } from '../IconButton';

import styles from './Slider.module.css';
import { SliderItem } from './SliderItem';
import { SliderProvider } from './SliderProvider';
import { UseSliderResult } from './useSlider.hook';

import { WithChildren } from '@common-types';

interface Props {
  loading?: boolean;
  store: UseSliderResult;
}

export function Slider({ children, loading = false, store }: WithChildren<Props>) {
  const listId = useId();
  const { actions, state } = store;

  useEffect(() => {
    actions.setLoading(loading);
  }, [actions, loading]);

  return (
    <SliderProvider store={store}>
      <section className={styles.sliderWrapper}>
        {state.hasOverflow.includes('prev') && (
          <div className={styles.prev}>
            <IconButton
              aria-controls={listId}
              icon={CoreAssets.Icons.ChevronLeft}
              label={`Scroll back in ${state.title} list`}
              level="secondary"
              size="sm"
              onClick={() => actions.scrollTo('prev')}
            />
          </div>
        )}

        <ul
          className={styles.sliderItemsWrapper}
          id={listId}
          ref={state.sliderListRef}
          title={state.title}
        >
          {Children.map(children, (child) => (
            <li className={styles.sliderItemWrapper}>{child}</li>
          ))}
        </ul>

        {state.hasOverflow.includes('next') && (
          <div className={styles.next}>
            <IconButton
              aria-controls={listId}
              icon={CoreAssets.Icons.ChevronRight}
              label={`Scroll forward in ${state.title} list`}
              level="secondary"
              size="sm"
              onClick={() => actions.scrollTo('next')}
            />
          </div>
        )}
      </section>
    </SliderProvider>
  );
}

Slider.Item = SliderItem;
