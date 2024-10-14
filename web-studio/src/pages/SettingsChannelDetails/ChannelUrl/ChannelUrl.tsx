import { CoreAssets } from '@noice-com/assets-core';
import { Button } from '@noice-com/common-ui';

import styles from './ChannelUrl.module.css';

interface Props {
  label: string;
  url: string;
}

export const ChannelUrl = ({ label, url }: Props) => {
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <div className={styles.urlWrapper}>
        <span
          className={styles.url}
          title={url}
        >
          {url}
        </span>
        <Button
          fit="content"
          iconStart={CoreAssets.Icons.Duplicate}
          level="secondary"
          size="xs"
          variant="solid"
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          Copy
        </Button>
      </div>
    </div>
  );
};
