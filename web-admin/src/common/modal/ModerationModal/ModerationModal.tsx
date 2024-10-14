import { WithChildren } from '@noice-com/common-ui';
import React from 'react';

import styles from './ModerationModal.module.css';

import { Button } from '@common/button';

interface HeaderProps {
  title: string;
  subtitleData: { label: string; value: number | string }[];
  imageElement: React.JSX.Element;
}

export const ModerationModalHeader = ({
  title,
  subtitleData,
  imageElement,
}: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div>{imageElement}</div>
      <div className={styles.headerData}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>
          {subtitleData.map(({ label, value }, index) => {
            return (
              <div
                className={styles.subtitleDataField}
                key={index}
              >
                <div className={styles.subtitleDataLabel}>{label}</div>
                <div className={styles.subtitleDataValue}>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface FooterProps extends WithChildren {
  submitButtonLabel: string;
  loading: boolean;
  onClose: () => void;
}

export const ModerationModalFooter = ({
  onClose,
  submitButtonLabel,
  loading,
}: FooterProps) => {
  return (
    <div className={styles.footer}>
      <Button
        buttonType="danger"
        disabled={loading}
        size="medium"
        text={submitButtonLabel}
        type="submit"
      />

      <Button
        buttonType="ghost"
        size="medium"
        text="Cancel"
        onClick={onClose}
      />
    </div>
  );
};
