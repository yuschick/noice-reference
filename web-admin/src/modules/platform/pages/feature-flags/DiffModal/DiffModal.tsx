import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

import { filter } from '../patch';
import { ConfigData, FeatureFlagConfig } from '../types';

import styles from './DiffModal.module.css';

import { Button } from '@common/button';
import { ModalDialog } from '@common/dialog';

interface Props {
  flagConfig: FeatureFlagConfig;
  open: boolean;
  onClose(): void;
  onSaveChanges(): void;
}

const getConfigDataJson = (configData: ConfigData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeTypeName = (obj: any) => {
    const objClone = { ...obj };

    if (objClone['__typename']) {
      delete objClone['__typename'];
    }

    Object.entries(objClone).forEach(([key, value]) => {
      if (typeof value === 'object') {
        objClone[key] = removeTypeName(value);
      }
    });

    return objClone;
  };

  return JSON.stringify(removeTypeName(configData), undefined, 2);
};

export function DiffModal({ flagConfig, open, onClose, onSaveChanges }: Props) {
  const changedFlags = [
    ...filter(flagConfig.updates, '/userFlags/flags'),
    ...filter(flagConfig.updates, '/channelFlags/flags'),
  ].reduce<string[]>((acc, cur) => {
    const flagName = cur.path.match(/^\/([\d\w-]+)/)?.[1];

    if (!flagName || acc.includes(flagName)) {
      return acc;
    }

    return [...acc, flagName];
  }, []);

  const onSave = () => {
    onClose();
    onSaveChanges();
  };

  return (
    <ModalDialog
      className={styles.modal}
      isOpen={open}
      title="Changes"
      onClose={onClose}
    >
      <div className={styles.content}>
        {changedFlags.length > 1 && (
          <div className={styles.warning}>
            <Icon
              icon={CoreAssets.Icons.Exclamation}
              size={28}
            />
            <span>{changedFlags.length} flags have changed config!</span>
          </div>
        )}

        {open && (
          <ReactDiffViewer
            compareMethod={DiffMethod.WORDS}
            newValue={getConfigDataJson(flagConfig.currentConfig)}
            oldValue={getConfigDataJson(flagConfig.originalConfig)}
            showDiffOnly
            splitView
            useDarkTheme
          />
        )}

        <div className={styles.buttons}>
          <Button
            text="Save changes"
            onClick={onSave}
          />

          <Button
            buttonType="ghost"
            text="Cancel"
            onClick={onClose}
          />
        </div>
      </div>
    </ModalDialog>
  );
}
