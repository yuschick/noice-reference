import { CoreAssets } from '@noice-com/assets-core';
import { DragAndDropWrapper, Icon, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { ChangeEvent, useId, useState } from 'react';
import { BiTrash } from 'react-icons/bi';

import { Button } from '../../button';

import styles from './UploadImageInput.module.css';

export interface Props extends WithChildren {
  label: string;
  loading?: boolean;
  hasChanges?: boolean;
  onRemove?: () => void;
  onChange(file: File): void;
}

export function UploadImageInput({
  label,
  onChange,
  onRemove,
  loading,
  children,
  hasChanges,
}: Props) {
  const [error, setError] = useState<Nullable<string>>(null);

  const errorId = useId();

  const onFileChange = (file: File) => {
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setError('Only PNG and JPEG files are supported');
      return;
    }

    setError(null);

    onChange(file);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onFileChange(file);
  };

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.disabled]: loading,
        [styles.changes]: hasChanges,
        [styles.showEmtpyValue]: !children,
        [styles.hasTextContent]: !children || typeof children === 'string',
      })}
    >
      <span className={styles.label}>{label}</span>

      <div className={styles.content}>
        <DragAndDropWrapper
          className={styles.dragAndDrop}
          loading={loading}
          onFileChange={onFileChange}
        >
          {children ? children : <div className={styles.emptyValue}>Upload file</div>}
        </DragAndDropWrapper>

        <div className={styles.buttons}>
          <label className={styles.inputWrapper}>
            Choose file
            <input
              accept="image/png, image/jpeg"
              aria-errormessage={error ? errorId : undefined}
              aria-invalid={error ? 'true' : 'false'}
              className={styles.input}
              disabled={loading}
              type="file"
              onChange={onInputChange}
            />
          </label>

          {!!children && !!onRemove && (
            <Button
              buttonType="ghost"
              icon={BiTrash}
              size="medium"
              text="Remove"
              type="button"
              onClick={onRemove}
            />
          )}
        </div>
      </div>

      {!!error && (
        <div
          className={styles.error}
          id={errorId}
        >
          <Icon
            className={styles.errorIcon}
            icon={CoreAssets.Icons.Exclamation}
            size={16}
          />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
