import { CoreAssets } from '@noice-com/assets-core';
import { Button, IconButton, PopoverMenu, usePopoverMenu } from '@noice-com/common-ui';
import { Fragment, ReactNode, useMemo, useState } from 'react';

import type {
  StreamInformation,
  StreamInformationComponentSubStatus,
} from '../../hooks/useStreamInformation.hook';

import styles from './StreamConnection.module.css';
import { StreamConnectionForceEndDialog } from './StreamConnectionForceEndDialog/StreamConnectionForceEndDialog';
import { StreamConnectionItem } from './StreamConnectionItem/StreamConnectionItem';

import { PermissionWrapper } from '@common/permission';
import { Status } from '@common/status';

interface Props {
  streamInformation: StreamInformation;
}

export function StreamConnection({ streamInformation }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const gameRunning = useMemo(() => {
    return (
      streamInformation.components.find(
        (component) => component.name === 'Noice Predictions',
      )?.status.status === Status.Active
    );
  }, [streamInformation.components]);

  // Todo: We might want to force end matches for NGC games as well, but currently too high effort to implement
  // https://linear.app/noice/issue/NOI-14457
  const showForceMatchEnd = streamInformation.selectedGameUsesML;

  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.ChevronDown}
        label={
          popover.state.popoverMenuIsOpen
            ? 'Hide stream status details'
            : 'Show stream status details'
        }
        ref={popover.state.popoverMenuTriggerRef}
        size="xs"
        variant="ghost"
        onClick={toggle}
      />

      <PopoverMenu store={popover}>
        <div className={styles.items}></div>
        {streamInformation.components.map((component) => (
          <StreamConnectionItem
            description={createDescription(component.subStatuses)}
            icon={component.icon}
            key={component.name}
            label={component.name}
            status={
              component.name === 'Stream Connection' &&
              streamInformation.mostSevereErrorOrWarning?.severity === 'error'
                ? {
                    text: 'Error',
                    status: Status.Error,
                  }
                : component.status
            }
          />
        ))}
        {gameRunning && showForceMatchEnd && (
          <PermissionWrapper>
            <PopoverMenu.Divider />

            <div className={styles.actions}>
              <Button
                level="secondary"
                size="sm"
                onClick={() => setShowConfirm(true)}
              >
                Force match end
              </Button>
            </div>
          </PermissionWrapper>
        )}
      </PopoverMenu>

      {showConfirm && <StreamConnectionForceEndDialog />}
    </>
  );
}

function createDescription(statuses: StreamInformationComponentSubStatus[]) {
  if (!statuses.length) {
    return null;
  }

  const out: ReactNode[] = [];

  for (const [index, status] of statuses.entries()) {
    out.push(
      <Fragment key={index}>
        {index > 0 && <br />}
        {status.severity === 'info' ? (
          <span>{status.content}</span>
        ) : (
          <span className={styles.itemDetails}>{status.content}</span>
        )}
      </Fragment>,
    );
  }

  return out;
}
