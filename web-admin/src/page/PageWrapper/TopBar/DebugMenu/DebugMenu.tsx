import {
  PopoverMenu,
  useFeatureFlagDebugInfo,
  usePopoverMenu,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { HiClipboardCopy } from 'react-icons/hi';
import { IoMdBug } from 'react-icons/io';

import styles from './DebugMenu.module.css';
import { useDebugMenuBuildInfo } from './hooks/useDebugMenuBuildInfo.hook';

import { Button, IconButton } from '@common/button';

export function DebugMenu() {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const { featureFlagsInfo, featureFlagsString, onReloadFlags } =
    useFeatureFlagDebugInfo('');

  const { buildInfos, showBuild, toggleShowBuild, buildInfoString } =
    useDebugMenuBuildInfo();

  const copyToClipBoardString = featureFlagsString + '\n' + buildInfoString;

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(
      copyToClipBoardString + '\n' + 'Timestamp: ' + new Date().toISOString(),
    );
  };

  return (
    <>
      <IconButton
        icon={IoMdBug}
        ref={popover.state.popoverMenuTriggerRef}
        text="Debug menu"
        onClick={toggle}
      />

      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          <div className={styles.section}>
            <div className={styles.header}>Remote Feature Flags</div>
            <ul className={styles.list}>
              {featureFlagsInfo.map(({ name, value, link }) => (
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

          <Button
            className={styles.copyClipboardButton}
            icon={HiClipboardCopy}
            text="Copy to clipboard"
            hideText
            onClick={onCopyButtonClick}
          />
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
