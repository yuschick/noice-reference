import { CoreAssets } from '@noice-com/assets-core';
import { Button, InputField, useAnalytics } from '@noice-com/common-ui';
import toast from 'react-hot-toast';

import styles from './RtmpSetup.module.css';

const RTMP_URL = 'rtmp://rtmp-premium.gcp.prd.noice.com/live';

export function RTMPSetup() {
  const { trackEvent } = useAnalytics();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RTMP_URL || '');
      toast.success('Copied RTMP URL to clipboard.');
      trackEvent({
        clientButtonClick: { action: 'copyRtmpUrl' },
      });
    } catch (error) {
      toast.error('Failed to copy RTMP URL to clipboard.');
    }
  };

  return (
    <div className={styles.rtmpSetupWrapper}>
      <h3 className={styles.title}>RTMP Url</h3>

      <div className={styles.inputWrapper}>
        <InputField
          label="RTMP Url"
          theme="gray"
          value={RTMP_URL}
          readOnly
        />

        <Button
          iconStart={CoreAssets.Icons.Duplicate}
          size="sm"
          onClick={handleCopy}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
