import { ButtonLink, Anchor } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { NavLink } from 'react-router-dom';

import { userSettingsRoutesWithLabels } from '../../const';

import styles from './SettingsMenu.module.css';

import { Routes } from '@common/route';

export function SettingsMenu() {
  const buildText = `Build ${NOICE.BUILD_HASH.slice(
    0,
    7,
  )} (${DateAndTimeUtils.getShortDate(NOICE.BUILD_TIME)})`;

  const navigationItems = userSettingsRoutesWithLabels;

  return (
    <>
      <nav aria-label="Settings">
        <ul className={styles.settingsSidebarNavigation}>
          {navigationItems.map(({ id, label }) => (
            <li key={id}>
              <NavLink
                className={styles.navigationItem}
                to={id}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <hr className={styles.divider} />
      <ButtonLink
        level="secondary"
        size="sm"
        to={Routes.Avatar}
      >
        Customize your avatar
      </ButtonLink>
      <hr className={styles.divider} />
      <div>
        <Anchor
          href="https://legal.noice.com/hc/en-us/articles/14879808972445-Noice-Third-Party-Licenses-Web-Client"
          showExternalLinkIcon
        >
          Open Source Licenses
        </Anchor>
        <div className={styles.build}>{buildText}</div>
      </div>
    </>
  );
}
