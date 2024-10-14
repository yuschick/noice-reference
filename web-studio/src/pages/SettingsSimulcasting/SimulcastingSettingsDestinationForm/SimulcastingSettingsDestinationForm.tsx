import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  ConfirmDialog,
  IconButton,
  InputField,
  Select,
  useAnalytics,
  useConfirmDialog,
  useLoadingPromise,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { FormEvent, useState } from 'react';

import styles from './SimulcastingSettingsDestinationForm.module.css';

import { PasswordInputWithReveal } from '@common/input';
import { useStreamContext } from '@common/stream';

export interface SimulcastingSettingsDestinationFormResult {
  rtmpEndpoint: string;
  rtmpKey: string;
  bitrate: number;
}

interface Bitrate {
  label: string;
  value: string;
  type: 'option';
  number: number;
}

const BITRATES: Bitrate[] = [
  { label: '8 Mbps (recommended)', value: '8000', type: 'option', number: 8000 },
  { label: '5 Mbps', value: '5000', type: 'option', number: 5000 },
  { label: '3 Mbps', value: '3000', type: 'option', number: 3000 },
];

interface Props {
  initialValues: Nullable<SimulcastingSettingsDestinationFormResult>;
  onSave: (formValues: SimulcastingSettingsDestinationFormResult) => void;
  onCancel: () => void;
  onDelete: () => Promise<void>;
}

export function SimulcastingSettingsDestinationForm({
  initialValues,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const { trackButtonClickEvent } = useAnalytics();
  const [rtmpEndpoint, setRtmpEndpoint] = useState<string>(
    initialValues?.rtmpEndpoint ?? '',
  );
  const [rtmpKey, setRtmpKey] = useState<string>(initialValues?.rtmpKey ?? '');
  const [bitrate, setBitrate] = useState<Bitrate>(
    BITRATES.find((bit) => bit.number === initialValues?.bitrate) ?? BITRATES[0],
  );

  const { hasRunningProcesses } = useStreamContext();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    trackButtonClickEvent('add-simulcasting-destination', {
      section: 'simulcasting-settings-destination-form',
    });
    event.preventDefault();
    await onSave({
      rtmpEndpoint: rtmpEndpoint.trim(),
      rtmpKey: rtmpKey.trim(),
      bitrate: bitrate.number,
    });
  };

  const [onSubmitFunc, loadingSave] = useLoadingPromise(onSubmit);
  const [onDeleteFunc, loadingDelete] = useLoadingPromise(onDelete);

  const dialog = useConfirmDialog({
    title: 'Are you sure you want to delete the settings?',
    onCancel: () => true,
    onConfirm: onDeleteFunc,
  });

  const isEditing = !!initialValues;
  const saveIsDisabled =
    loadingDelete || !rtmpEndpoint || !rtmpKey || hasRunningProcesses;
  const deleteIsDisabled = loadingSave || !isEditing || hasRunningProcesses;
  const cancelIsDisabled = loadingSave || loadingDelete;

  return (
    <div className={styles.destinationFormRoot}>
      <ConfirmDialog store={dialog} />

      <div className={styles.destinationFormBackWrapper}>
        <IconButton
          icon={CoreAssets.Icons.ChevronLeft}
          label="Back to simulcasting settings overview"
          level="secondary"
          onClick={onCancel}
        />
        <h1 className={styles.destinationFormBackTitle}>Simulcasting</h1>
      </div>

      <h2 className={styles.destinationFormTitle}>Destination</h2>
      <div className={styles.destinationFormBgWrapper}>
        <form
          className={styles.destinationFormWrapper}
          onSubmit={onSubmitFunc}
        >
          <InputField
            defaultValue={rtmpEndpoint}
            isDisabled={hasRunningProcesses}
            label="Destination URL"
            size="lg"
            theme="gray"
            onChange={(e) => setRtmpEndpoint(e.target.value)}
          />
          <PasswordInputWithReveal
            defaultValue={rtmpKey}
            isDisabled={hasRunningProcesses}
            label="Stream Key"
            preventRevealPassword={isEditing}
            size="lg"
            theme="gray"
            onChange={(e) => setRtmpKey(e.target.value)}
          />
          <Select
            color="gray"
            isDisabled={hasRunningProcesses}
            label="Video bitrate"
            options={BITRATES}
            selectSize="lg"
            value={bitrate.value}
            onChange={(event) => {
              const selectedBitrate = BITRATES.find(
                (b) => b.value === event.target.value,
              );
              if (selectedBitrate) {
                setBitrate(selectedBitrate);
              }
            }}
          />

          <div className={styles.destinationFormActions}>
            <Button
              fit="content"
              isDisabled={saveIsDisabled}
              isLoading={loadingSave}
              type="submit"
              variant="cta"
            >
              Save
            </Button>
            <Button
              fit="content"
              isDisabled={cancelIsDisabled}
              level="secondary"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>

            {isEditing && (
              <div className={styles.destinationFormDeleteWrapper}>
                <Button
                  fit="content"
                  isDisabled={deleteIsDisabled}
                  isLoading={loadingDelete}
                  level="secondary"
                  onClick={dialog.actions.open}
                >
                  Delete destination
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
