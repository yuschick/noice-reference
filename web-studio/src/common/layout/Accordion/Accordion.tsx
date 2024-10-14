import { CoreAssets } from '@noice-com/assets-core';
import { Icon, WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import React, { KeyboardEventHandler, useEffect, useRef } from 'react';

import styles from './Accordion.module.css';
import { useAccordionContext } from './AccordionProvider';

export function Accordion({ children }: WithChildren) {
  return <div className={styles.wrapper}>{children}</div>;
}

export interface Props extends WithChildren {
  id: string;
  title: string;
  description?: string;
  isDisabled?: boolean;
  HeaderIcon?: React.JSX.Element;
}

function AccordionSection({
  id,
  title,
  description,
  children,
  isDisabled,
  HeaderIcon,
}: Props) {
  const { toggleSection, expandedSectionIds } = useAccordionContext();
  const onToggleSection = () => !isDisabled && toggleSection(id);
  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggleSection();
    }
  };

  const isExpanded = expandedSectionIds.has(id);
  const sectionId = `${id}-section`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded || !ref.current || isDisabled) {
      return;
    }

    ref.current.scrollIntoView();
  }, [isDisabled, isExpanded]);

  return (
    <div
      className={styles.section}
      ref={ref}
    >
      <header>
        <div
          aria-controls={sectionId}
          aria-disabled={isDisabled}
          aria-expanded={isExpanded}
          className={classNames(styles.headerContent, { [styles.active]: !isDisabled })}
          id={id}
          role="button"
          tabIndex={0}
          onClick={onToggleSection}
          onKeyDown={handleKeyDown}
        >
          <div>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>{title}</div>
              {HeaderIcon}
            </div>
            {!!description && isExpanded && (
              <div className={styles.description}>{description}</div>
            )}
          </div>
          <Icon
            className={styles.chevron}
            icon={
              !isExpanded ? CoreAssets.Icons.ChevronRight : CoreAssets.Icons.ChevronDown
            }
            size={20}
          />
        </div>
      </header>
      <div
        aria-labelledby={id}
        className={classNames(styles.content, { [styles.hide]: !isExpanded })}
        id={sectionId}
        role="region"
      >
        {children}
      </div>
    </div>
  );
}

Accordion.Section = AccordionSection;
