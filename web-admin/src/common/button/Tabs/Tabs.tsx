import { Icon } from '@noice-com/common-ui';
import { NavLink } from 'react-router-dom';

import { TabModel } from '../types';

import styles from './Tabs.module.css';

import { Pill } from '@common/text';

export interface Props {
  tabs: TabModel[];
}

export function Tabs({ tabs }: Props) {
  return (
    <nav className={styles.tabsNavigation}>
      <ul className={styles.tabList}>
        {tabs.map(({ title, to, icon, type, totalAmount }) => (
          <li key={to}>
            <NavLink
              className={styles.tab}
              to={to}
            >
              {icon && (
                <Icon
                  icon={icon}
                  size={16}
                />
              )}

              <span>{title}</span>

              {!!totalAmount && (
                <Pill
                  text={`${totalAmount}`}
                  type={type ?? 'info'}
                />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
