import {
  useFeatureFlagDebugInfo,
  IconButton,
  usePopoverMenu,
  PopoverMenu,
  useAuthentication,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { RefObject } from 'react';
import { HiClipboardCopy } from 'react-icons/hi';
import { IoMdBug } from 'react-icons/io';

import styles from './DebugMenu.module.css';
import { useDebugMenuBuildInfo } from './hooks/useDebugMenuBuildInfo.hook';

interface Props {
  popoverAnchorRef?: RefObject<HTMLElement>;
  renderAsPopoverButton?: boolean;
}

export function DebugMenu({ popoverAnchorRef, renderAsPopoverButton }: Props) {
  const popover = usePopoverMenu({
    placement: 'bottom',
    options: {
      anchorRef: popoverAnchorRef,
    },
  });
  const { toggle } = popover.actions;
  const { hasRole } = useAuthentication();
  const isAdmin = hasRole('admin');

  const { featureFlagsInfo, featureFlagsString, onReloadFlags } = useFeatureFlagDebugInfo(
    NOICE.ADMIN_URL,
  );

  const { buildInfos, showBuild, toggleShowBuild, buildInfoString } =
    useDebugMenuBuildInfo();

  const copyToClipBoardString = isAdmin
    ? featureFlagsString + '\n' + buildInfoString
    : buildInfoString;

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(
      copyToClipBoardString + '\n' + 'Timestamp: ' + new Date().toISOString(),
    );
  };

  return (
    <>
      {renderAsPopoverButton ? (
        <PopoverMenu.Button
          ref={popover.state.popoverMenuTriggerRef}
          onClick={toggle}
        >
          Debug Menu
        </PopoverMenu.Button>
      ) : (
        <IconButton
          icon={IoMdBug}
          label="Debug menu"
          ref={popover.state.popoverMenuTriggerRef}
          size="sm"
          variant="ghost"
          onClick={toggle}
        />
      )}

      <PopoverMenu store={popover}>
        {isAdmin && (
          <>
            <PopoverMenu.Section>
              <div className={styles.section}>
                <div className={styles.header}>Remote Feature Flags</div>
                <ul className={styles.list}>
                  {featureFlagsInfo
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(({ name, value, link }) => (
                      <li
                        className={styles.listItem}
                        key={name}
                      >
                        <a
                          className={styles.link}
                          href={link}
                        >
                          {name}
                        </a>
                        : <span className={styles.listItemValue}>{value}</span>
                      </li>
                    ))}
                </ul>
                <button
                  className={styles.button}
                  onClick={onReloadFlags}
                >
                  Reload
                </button>
              </div>
            </PopoverMenu.Section>

            <PopoverMenu.Divider />
          </>
        )}

        <PopoverMenu.Section>
          <div className={styles.section}>
            <div className={styles.header}>
              Build Info{' '}
              <button
                className={classNames(styles.button, styles.headerButton)}
                onClick={toggleShowBuild}
              >
                {showBuild ? '[hide]' : '[show]'}
              </button>
            </div>

            {showBuild && (
              <ul className={styles.list}>
                {buildInfos.map((info) => (
                  <li
                    className={styles.listItem}
                    key={info.label}
                  >
                    {info.label}:{' '}
                    <span className={styles.listItemValue}>{info.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverMenu.Section>

        <div className={styles.copyClipboardButton}>
          <IconButton
            icon={HiClipboardCopy}
            label="Copy to clipboard"
            level="secondary"
            size="sm"
            onClick={onCopyButtonClick}
          />
        </div>
      </PopoverMenu>
    </>
  );
}
