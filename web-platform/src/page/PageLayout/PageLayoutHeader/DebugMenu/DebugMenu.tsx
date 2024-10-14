import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { useClient } from '@noice-com/common-react-core';
import {
  Breakpoint,
  CommonUtils,
  Icon,
  IconButton,
  PopoverMenu,
  useAuthentication,
  useFeatureFlagDebugInfo,
  useMediaQuery,
  usePopoverMenu,
} from '@noice-com/common-ui';
import { Client } from '@noice-com/platform-client';
import { Nullable, makeLoggers } from '@noice-com/utils';
import classNames from 'classnames';
import { FaLink } from 'react-icons/fa';
import { HiClipboardCopy } from 'react-icons/hi';
import { IoMdBug } from 'react-icons/io';

import styles from './DebugMenu.module.css';
import { useDebugMenuBuildInfo } from './hooks/useDebugMenuBuildInfo.hook';
import { useDebugMenuFeatures } from './hooks/useDebugMenuFeatures.hook';
import { useDebugMenuMatchInfo } from './hooks/useDebugMenuMatchInfo.hook';

import { useDebugContext } from '@common/debug';
import { useStreamGame } from '@common/stream';
import { DebugMenuProfileFragment } from '@gen';

const { log } = makeLoggers('debug');

gql`
  fragment DebugMenuProfile on ProfileProfile {
    ...DebugMenuMatchInfoProfile
  }
`;

interface Props {
  profile: Nullable<DebugMenuProfileFragment>;
  renderAsPopoverButton?: boolean;
}

export function DebugMenu({ renderAsPopoverButton, profile }: Props) {
  const { isFullAccount, hasRole } = useAuthentication();
  const showAsOverlay = useMediaQuery(
    `(max-width: ${CommonUtils.getRem(isFullAccount ? 599 : 1099)})`,
  );
  const popover = usePopoverMenu({
    options: { display: showAsOverlay ? 'overlay' : 'popover' },
    placement: 'top',
  });
  const { toggle } = popover.actions;

  const client = useClient();
  const isAdmin = hasRole('admin');

  const { forceChannelOnline, canForceChannelOnline, onForceChannelOnlineButtonClick } =
    useDebugContext();
  const { streamId, gameInstance } = useStreamGame();
  const isDebugLogAvailable = !!gameInstance;

  const {
    featureFlagsInfo: remoteFlagsInfo,
    featureFlagsString: remoteFeatureFlagsString,
    onReloadFlags: onReloadRemoteFlags,
  } = useFeatureFlagDebugInfo(NOICE.ADMIN_URL);

  const {
    featureFlagItems,
    onFeatureButtonClick,
    handleOnCopyUrlWithFeatureFlags,
    featureFlagsString,
    onResetButtonClick,
  } = useDebugMenuFeatures();

  const { showMatch, matchInfos, toggleShowMatch, matchInfoString } =
    useDebugMenuMatchInfo({ profile });

  const { buildInfos, showBuild, toggleShowBuild, buildInfoString } =
    useDebugMenuBuildInfo();

  const copyToClipBoardString = isAdmin
    ? featureFlagsString +
      '\n' +
      remoteFeatureFlagsString +
      '\n' +
      matchInfoString +
      '\n' +
      buildInfoString
    : matchInfoString + '\n' + buildInfoString;

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(
      copyToClipBoardString + '\n' + 'Timestamp: ' + new Date().toISOString(),
    );
  };

  const onDebugButtonClick = () => {
    window.NOICE.showDebug();
  };

  const getState = async (client: Client) => {
    if (!client.MatchService.getGroup()) {
      return null;
    }

    if (!streamId) {
      return null;
    }

    const stream = await client.MatchService.getStreamState(streamId);

    if (!stream || !stream.groups) {
      return null;
    }

    const g = await Promise.all(
      stream.groups.map((groupId) =>
        client.MatchService.getGroupState(streamId, groupId),
      ),
    );

    const state = { ...stream, groups: g };

    return state;
  };

  const onDumpStateButtonClick = async () => {
    const state = await getState(client);
    if (!state) {
      return;
    }

    log('Game logic state dump:', state);
  };

  const onDownloadStateButtonClick = async () => {
    const state = await getState(client);
    if (!state) {
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gameStateDump-${timestamp}-${streamId}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const onAdvanceTimeClick = (sec: number) => () => {
    if (!client.MatchService.getGroup()) {
      return;
    }

    client.MatchService.advanceGroupTime(sec);
  };

  const onForceChannelOnlineButtonClickCallback = () => {
    onForceChannelOnlineButtonClick();
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
                <div className={styles.header}>
                  Feature Flags
                  <button
                    className={classNames(styles.button, styles.headerButton)}
                    onClick={handleOnCopyUrlWithFeatureFlags}
                  >
                    <Icon
                      icon={FaLink}
                      size={11}
                    />
                  </button>
                </div>

                <ul className={styles.list}>
                  {featureFlagItems
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((feature) => {
                      return (
                        <li
                          className={styles.listItem}
                          key={feature.name}
                        >
                          {feature.name}:{' '}
                          <button
                            className={styles.button}
                            onClick={() =>
                              onFeatureButtonClick(feature.name, feature.status)
                            }
                          >
                            {feature.status ? 'enabled' : 'disabled'}
                          </button>
                          {feature.persisted && ' (persisted)'}
                        </li>
                      );
                    })}
                </ul>

                <button
                  className={styles.button}
                  onClick={onResetButtonClick}
                >
                  Reset to defaults
                </button>
              </div>
            </PopoverMenu.Section>

            <PopoverMenu.Divider />
          </>
        )}

        {isAdmin && (
          <>
            <PopoverMenu.Section>
              <div className={styles.section}>
                <div className={styles.header}>Remote Feature Flags</div>
                <ul className={styles.list}>
                  {remoteFlagsInfo.map(({ name, value, link }) => (
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
                  onClick={onReloadRemoteFlags}
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
              Match Info{' '}
              <button
                className={classNames(styles.button, styles.headerButton)}
                onClick={toggleShowMatch}
              >
                {showMatch ? '[hide]' : '[show]'}
              </button>
            </div>

            {showMatch && (
              <ul className={styles.list}>
                {matchInfos.map((info) => (
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

            {canForceChannelOnline && isAdmin && (
              <button
                className={styles.button}
                onClick={onForceChannelOnlineButtonClickCallback}
              >
                {forceChannelOnline
                  ? 'Reset channel force online'
                  : 'Force channel online'}
              </button>
            )}
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
        </PopoverMenu.Section>

        {isAdmin && isDebugLogAvailable && (
          <PopoverMenu.Section>
            <div className={styles.section}>
              <button
                className={styles.button}
                onClick={onDebugButtonClick}
              >
                Open debug log
              </button>
            </div>
          </PopoverMenu.Section>
        )}

        {isAdmin && (
          <>
            <PopoverMenu.Divider />

            <PopoverMenu.Section>
              <div className={classNames(styles.columnContainer, styles.section)}>
                <div className={styles.header}>Admin</div>

                <button
                  className={styles.button}
                  onClick={onDumpStateButtonClick}
                >
                  Dump state
                </button>

                <button
                  className={styles.button}
                  onClick={onDownloadStateButtonClick}
                >
                  Download state
                </button>

                <ul className={classNames(styles.list, styles.horizontalList)}>
                  <li>Advance time:</li>
                  <li>
                    <button
                      className={styles.button}
                      onClick={onAdvanceTimeClick(5)}
                    >
                      +5s
                    </button>
                  </li>
                  <li>
                    <button
                      className={styles.button}
                      onClick={onAdvanceTimeClick(15)}
                    >
                      +15s
                    </button>
                  </li>
                  <li>
                    <button
                      className={styles.button}
                      onClick={onAdvanceTimeClick(30)}
                    >
                      +30s
                    </button>
                  </li>
                </ul>
              </div>
            </PopoverMenu.Section>
          </>
        )}

        <div className={styles.buttonsWrapper}>
          <IconButton
            icon={HiClipboardCopy}
            label="Copy to clipboard"
            level="secondary"
            size="sm"
            onClick={onCopyButtonClick}
          />
          <Breakpoint
            query={`(max-width: ${CommonUtils.getRem(isFullAccount ? 599 : 1099)})`}
          >
            <IconButton
              icon={CoreAssets.Icons.Close}
              label="Close debug menu"
              level="secondary"
              size="sm"
              onClick={popover.actions.toggle}
            />
          </Breakpoint>
        </div>
      </PopoverMenu>
    </>
  );
}
