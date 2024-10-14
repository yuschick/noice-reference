import {
  Icon,
  NoiceLogo,
  useAuthenticatedUser,
  useOnOutsideClick,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useRef, useState } from 'react';
import { BiLogOutCircle, BiUser, BiUserCircle } from 'react-icons/bi';
import { generatePath } from 'react-router-dom';

import { DebugMenu } from './DebugMenu/DebugMenu';
import { Navigation } from './Navigation/Navigation';
import { SearchBox } from './SearchBox';
import styles from './TopBar.module.css';

import { IconButton } from '@common/button';
import { PermissionLink } from '@common/permission';
import { LoginRoutes } from '@common/route';

interface Props {
  className?: string;
}

export function TopBar({ className }: Props) {
  const userMenuButton = useRef(null);
  const userMenu = useRef(null);
  const { userId } = useAuthenticatedUser();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const onOutsideClick = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  useOnOutsideClick(userMenuButton, onOutsideClick, {
    exempt: [userMenu],
  });

  const userMenuItems = [
    {
      icon: BiUserCircle,
      text: 'Open own profile',
      to: generatePath('/users/:userId', { userId }),
    },
    {
      icon: BiLogOutCircle,
      text: 'Log out',
      to: LoginRoutes.LogOut,
    },
  ];

  return (
    <header className={classNames(styles.wrapper, className)}>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.logoWrapper}>
            <NoiceLogo
              className={styles.icon}
              theme="spectrum"
              variant="mark"
            />
            <span className={styles.text}>Admin</span>
          </div>

          <Navigation />

          <SearchBox />
        </div>

        <div className={styles.rightContainer}>
          <DebugMenu />

          <div className={styles.userMenuWrapper}>
            <IconButton
              icon={BiUser}
              ref={userMenuButton}
              text={`${showUserMenu ? 'Hide' : 'Show'} user menu`}
              onClick={() => {
                setShowUserMenu((prev) => !prev);
              }}
            />

            {showUserMenu && (
              <ul
                className={styles.userMenu}
                ref={userMenu}
              >
                {userMenuItems.map(({ icon, text, to }, index) => (
                  <li key={index}>
                    <PermissionLink
                      className={styles.userMenuLink}
                      to={to}
                      onClick={onOutsideClick}
                    >
                      <Icon
                        className={styles.icon}
                        icon={icon}
                      />
                      <span className={styles.title}>{text}</span>
                    </PermissionLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
