import { Callout, WithChildren } from '@noice-com/common-ui';
import { StringUtils } from '@noice-com/utils';
import { Children, ReactNode, isValidElement } from 'react';

import styles from './SettingsGroup.module.css';
import { SettingsGroupAction } from './SettingsGroupAction';

interface Props {
  as?: 'ul' | 'div';
  description?: string;
  helpText?: string;
  title: string;
}

export function SettingsGroup({
  as,
  children,
  description,
  helpText,
  title,
}: WithChildren<Props>) {
  let Action, SettingsCallout;
  const Element = as ?? 'ul';
  const subChildren: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === SettingsGroupAction) {
      Action = child;
      return;
    }

    if (child.type === Callout) {
      SettingsCallout = child;
      return;
    }

    subChildren.push(child);
  });

  return (
    <section
      className={styles.settingsGroup}
      id={StringUtils.stringToKebabCase(title)}
    >
      <section className={styles.groupHeader}>
        <div>
          <h3 className={styles.groupTitle}>{title}</h3>
          <p className={styles.groupDescription}>{description}</p>
        </div>
        {Action}
      </section>

      {SettingsCallout}

      {!!subChildren.length && (
        <Element className={styles.groupList}>
          {subChildren.map((child) => child)}
        </Element>
      )}

      {!!helpText && <p className={styles.groupHelpText}>{helpText}</p>}
    </section>
  );
}

SettingsGroup.Action = SettingsGroupAction;
