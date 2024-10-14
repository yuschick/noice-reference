import { useContext } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Slider } from '../Slider';

import styles from './CategoryFilter.module.css';
import { CategoryFilterContext } from './CategoryFilterProvider';

type Props = Omit<
  LinkProps,
  'aria-current' | 'aria-selected' | 'className' | 'role' | 'style' | 'tabIndex'
> & {
  isSelected?: boolean;
};

export function CategoryFilterLink({
  children,
  isSelected,
  to,
  ...htmlAttributes
}: Props) {
  const context = useContext(CategoryFilterContext);

  if (!context) {
    throw new Error('CategoryFilter.Link can only be used within a CategoryFilter.');
  }

  return (
    <Slider.Item>
      <Link
        {...htmlAttributes}
        aria-current={isSelected ? 'page' : undefined}
        className={styles.selectorItem}
        tabIndex={-1}
        to={to}
      >
        {children}
      </Link>
    </Slider.Item>
  );
}
