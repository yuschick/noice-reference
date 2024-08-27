import { useContext } from 'react';

import { HTMLButtonAttributes } from '../Button/Button.types';
import { Slider } from '../Slider';

import styles from './CategoryFilter.module.css';
import { CategoryFilterContext } from './CategoryFilterProvider';

type Props = Omit<
  HTMLButtonAttributes,
  'aria-current' | 'aria-selected' | 'className' | 'role' | 'style' | 'tabIndex' | 'type'
> & {
  isSelected?: boolean;
};

export function CategoryFilterButton({
  children,
  isSelected,
  onClick,
  ...htmlAttributes
}: Props) {
  const context = useContext(CategoryFilterContext);

  if (!context) {
    throw new Error('CategoryFilter.Button can only be used within a CategoryFilter.');
  }

  return (
    <Slider.Item>
      <button
        {...htmlAttributes}
        aria-current={isSelected}
        className={styles.selectorItem}
        tabIndex={-1}
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    </Slider.Item>
  );
}
