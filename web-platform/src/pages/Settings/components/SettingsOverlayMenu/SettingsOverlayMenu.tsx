import { CoreAssets } from '@noice-com/assets-core';
import { IconButton } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';

import { SettingsMenu } from '../SettingsMenu/SettingsMenu';

import styles from './SettingsOverlayMenu.module.css';

interface Props {
  handleHideMenu: () => void;
}

export function SettingsOverlayMenu({ handleHideMenu }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        if (width > 720) {
          handleHideMenu();
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleHideMenu]);

  return (
    <div
      className={styles.overlayMenuContainer}
      ref={containerRef}
    >
      <div className={styles.navigationContainer}>
        <IconButton
          icon={CoreAssets.Icons.ArrowLeft}
          label="Return to settings"
          level="secondary"
          size="sm"
          onClick={handleHideMenu}
        />
        <h1 className={styles.menuTitle}>Settings</h1>
      </div>

      <SettingsMenu />
    </div>
  );
}
