import { Children, isValidElement } from 'react';

import { LoadingSkeleton } from '../LoadingSkeleton';
import { Slider } from '../Slider';
import { useSlider } from '../Slider/useSlider.hook';

import styles from './CategoryFilter.module.css';
import { CategoryFilterButton } from './CategoryFilterButton';
import { CategoryFilterItem } from './CategoryFilterItem';
import { CategoryFilterLink } from './CategoryFilterLink';
import { CategoryFilterProvider } from './CategoryFilterProvider';

import { WithChildren } from '@common-types';

interface Props {
  loading?: boolean;
  title: string;
}

export function CategoryFilter({
  children,
  loading = false,
  title,
}: WithChildren<Props>) {
  const store = useSlider({ title });

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (
      child.type !== CategoryFilterButton &&
      child.type !== CategoryFilterLink &&
      child.type !== CategoryFilterItem
    ) {
      throw new Error(`Category Filter: Invalid child type: ${child.type}`);
    }
  });

  if (loading) {
    const clientWidth = document.documentElement.clientWidth;

    return (
      <div>
        <LoadingSkeleton
          className={styles.loadingItem}
          count={Math.min(Math.floor(clientWidth / 200), 5)}
          direction="row"
          height={40}
          width={200}
        />
      </div>
    );
  }

  return (
    <CategoryFilterProvider>
      <Slider
        loading={loading}
        store={store}
      >
        {children}
      </Slider>
    </CategoryFilterProvider>
  );
}

CategoryFilter.Button = CategoryFilterButton;
CategoryFilter.Link = CategoryFilterLink;
CategoryFilter.Item = CategoryFilterItem;
