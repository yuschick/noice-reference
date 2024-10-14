import classNames from 'classnames';
import { DragEvent, useState } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';

import styles from './DragAndDropWrapper.module.css';

import { WithChildren } from '@common-types';

export interface Props extends WithChildren {
  className?: string;
  loading?: boolean;
  isDisabled?: boolean;
  onFileChange(file: File): void;
}

export function DragAndDropWrapper({
  children,
  className,
  loading,
  isDisabled,
  onFileChange,
}: Props) {
  const [showDrag, setShowDrag] = useState(false);

  const onDrag = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    setShowDrag(true);
  };

  const onDragExit = () => {
    setShowDrag(false);
  };

  const onDrop = (event: DragEvent) => {
    if (!event.dataTransfer) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    setShowDrag(false);

    const file = event.dataTransfer.files[0];

    onFileChange(file);
  };

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.showDrag]: showDrag,
      })}
      onDragEnter={onDrag}
      onDragExit={onDragExit}
      onDragLeave={onDragExit}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      {children}

      <div className={styles.dragArea}>
        <span>Drop it!</span>
      </div>

      {loading && (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
