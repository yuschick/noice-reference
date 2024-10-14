import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, Tooltip } from '@noice-com/common-ui';
import { useState } from 'react';

import styles from './InvitationCode.module.css';

interface Props {
  code: string;
}

export function InvitationCode({ code }: Props) {
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 2000);
  };

  return (
    <div className={styles.invitationCodeWrapper}>
      <div className={styles.codeWrapper}>
        <span>{code}</span>
      </div>
      <Tooltip
        content={
          isCodeCopied ? <span className={styles.copiedTooltip}>Copied</span> : 'Copy'
        }
        placement="top"
      >
        <IconButton
          icon={isCodeCopied ? CoreAssets.Icons.Check : CoreAssets.Icons.Copy}
          label={'Copy invitation code'}
          level="secondary"
          size="xs"
          onClick={handleCopyClick}
        />
      </Tooltip>
    </div>
  );
}
