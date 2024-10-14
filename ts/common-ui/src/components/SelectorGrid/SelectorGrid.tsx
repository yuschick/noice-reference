import { useMountEffect } from '@noice-com/common-react-core';
import classNames from 'classnames';
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { IconButton } from '../IconButton';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './SelectorGrid.module.css';

export interface Props {
  pageSize: number;
  rowSize: number;
  value?: string;
  values: { id: string; imgSrc: string }[];
  label: string;
  className?: string;
  onValueSelect(id: string): void;
  onPageChange(index: number): void;
}

export function SelectorGrid({
  pageSize,
  rowSize,
  value,
  values,
  label,
  className,
  onValueSelect,
  onPageChange,
}: Props) {
  const [selectedValue, setSelectedValue] = useState<undefined | string>();
  const [selectedPage, setSelectedPage] = useState(0);
  const [goingForward, setGoingForward] = useState(true);
  const listboxRef = useRef<HTMLDivElement>(null);
  const previousSelectedPage = useRef(selectedPage);

  const onPageChangeFunc = useCallback(
    (index: number) => {
      setSelectedPage(index);
      onPageChange(index);
    },
    [onPageChange],
  );

  const pagedValues = useMemo(() => {
    const pages = [];

    for (let i = 0; i < values.length; i += pageSize) {
      pages.push(values.slice(i, i + pageSize));
    }

    return pages;
  }, [pageSize, values]);

  const previousPageIndex =
    pagedValues.length > 1
      ? // multiple pages
        !selectedPage
        ? // selected page is not the first, so previous is one less
          pagedValues.length - 1
        : // selected page is the first, so previous is the last
          selectedPage - 1
      : // only one page, so no previous page
        -1;
  const nextPageIndex =
    pagedValues.length > 1
      ? // multiple pages
        selectedPage === pagedValues.length - 1
        ? // selected page is the first, so next one is the first
          0
        : // selected page is not the last, so previous is one more
          selectedPage + 1
      : // only one page, so no next page
        -1;

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!(event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        return;
      }

      if (event.target !== listboxRef.current) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        setSelectedValue((prev) => {
          const currentIndex = values.findIndex((value) => prev === value.id);

          // First one selected, so return the last one from array
          if (!currentIndex) {
            return values[values.length - 1].id;
          }

          return values[currentIndex - 1].id;
        });
        return;
      }

      setSelectedValue((prev) => {
        const currentIndex = values.findIndex((value) => prev === value.id);

        // Last on selected, so return the first one from array
        if (currentIndex === values.length - 1) {
          return values[0].id;
        }

        return values[currentIndex + 1].id;
      });
    },
    [values],
  );

  const onPrevClick = useCallback(() => {
    onPageChangeFunc(previousPageIndex);
  }, [previousPageIndex, onPageChangeFunc]);

  const onNextClick = useCallback(() => {
    onPageChangeFunc(nextPageIndex);
  }, [nextPageIndex, onPageChangeFunc]);

  useMountEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  useEffect(() => {
    if (!value) {
      return;
    }

    if (!values.some((v) => v.id === value)) {
      return;
    }

    setSelectedValue(value);
  }, [value, values]);

  useEffect(() => {
    if (!selectedValue) {
      return;
    }

    onValueSelect(selectedValue);

    // Check in what page the selected value is and set that page as selected page
    const selectedValuesPage = pagedValues.findIndex((values) =>
      values.some((value) => value.id === selectedValue),
    );
    setSelectedPage(selectedValuesPage);
  }, [onValueSelect, pagedValues, selectedValue]);

  useEffect(() => {
    // When previous page was the first one, pager is going forward when next page number is bigger,
    // unless it is the last one, then it is going backwards
    if (!previousSelectedPage.current) {
      setGoingForward(
        previousSelectedPage.current < selectedPage &&
          selectedPage !== pagedValues.length - 1,
      );
    }
    // When previous page was the last one, pager is going forward when next page is the first page
    else if (previousSelectedPage.current === pagedValues.length - 1) {
      setGoingForward(!selectedPage);
    }
    // When previous page is not the first or last page, pager is going forward when next page is bigger
    else {
      setGoingForward(previousSelectedPage.current < selectedPage);
    }

    previousSelectedPage.current = selectedPage;
  }, [pagedValues.length, selectedPage]);

  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={{ '--selector-grid-row-width': `${100 / rowSize}%` } as CSSProperties}
    >
      {previousPageIndex >= 0 && (
        <div className={classNames(styles.button, styles.previousButton)}>
          <IconButton
            icon={FaChevronLeft}
            label="Previous page"
            type="button"
            variant="ghost"
            onClick={onPrevClick}
          />
        </div>
      )}

      <div
        aria-activedescendant={selectedValue}
        aria-label={label}
        className={classNames(styles.listbox, {
          [styles.goingBackward]: !goingForward,
          [styles.goingForward]: goingForward,
        })}
        ref={listboxRef}
        role="listbox"
        tabIndex={0}
      >
        {pagedValues.map((values, index) => (
          <ul
            aria-label={`Page ${index + 1}`}
            className={classNames(styles.list, {
              [styles.nonActivePage]: selectedPage !== index,
              [styles.activePage]: selectedPage === index,
              [styles.previousPage]: previousPageIndex === index,
              [styles.nextPage]: nextPageIndex === index,
              [styles.absolutePages]: index,
            })}
            key={`selector-page-${index}`}
            role="group"
          >
            {values.map(({ id, imgSrc }) => (
              <li
                aria-selected={selectedValue === id}
                className={styles.option}
                id={id}
                key={id}
                role="option"
              >
                <button
                  aria-label={`Select ${name}`}
                  className={styles.optionContent}
                  type="button"
                  onClick={() => setSelectedValue(id)}
                >
                  <img
                    alt={label}
                    className={styles.img}
                    src={imgSrc}
                  />
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {pagedValues.length > 1 && (
        <ul className={styles.pager}>
          {pagedValues.map((_, index) => (
            <li key={`selector-grid-page-${index}`}>
              <button
                className={classNames(styles.pagerButton, {
                  [styles.activePagerButton]: selectedPage === index,
                })}
                type="button"
                onClick={() => onPageChangeFunc(index)}
              >
                <div className={styles.pagerDot} />
                <VisuallyHidden>Go to page {index + 1}</VisuallyHidden>
              </button>
            </li>
          ))}
        </ul>
      )}

      {nextPageIndex >= 0 && (
        <div className={classNames(styles.button, styles.nextButton)}>
          <IconButton
            icon={FaChevronRight}
            label="Next page"
            type="button"
            variant="ghost"
            onClick={onNextClick}
          />
        </div>
      )}
    </div>
  );
}
