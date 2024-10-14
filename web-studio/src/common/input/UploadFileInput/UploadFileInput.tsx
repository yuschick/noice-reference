import classNames from 'classnames';
import { ChangeEvent, ComponentProps, forwardRef } from 'react';

import styles from './UploadFileInput.module.css';

interface Props extends Omit<ComponentProps<'input'>, 'onChange' | 'ref' | 'size'> {
  fileType: 'video' | 'image';
  onValueChange(file: File): void;
}

export const UploadFileInput = forwardRef<HTMLInputElement, Props>(
  function UploadFileInput(
    { onValueChange, accept, fileType, disabled, className },
    externalRef,
  ) {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      onValueChange(file);
    };

    return (
      <label className={classNames(className, styles.label)}>
        Upload {fileType}
        <input
          accept={accept}
          className={styles.input}
          disabled={disabled}
          ref={externalRef}
          type="file"
          onChange={onChange}
        />
      </label>
    );
  },
);
