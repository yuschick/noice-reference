import { CoreAssets } from '@noice-com/assets-core';
import { Button, Callout, useAnalytics } from '@noice-com/common-ui';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';

import styles from './Alerts.module.css';

import { LayoutBox, PageHeading } from '@common/layout';
import { Routes } from '@common/route';

type RouteParams = {
  channelName: string;
};

export function Alerts() {
  const section = 'alerts';
  const { trackButtonClickEventOnMouseClick } = useAnalytics();
  const { channelName } = useParams<RouteParams>();

  const onCopyUrlClick = (alertType: string) => {
    if (!channelName) {
      return;
    }
    const url =
      `${window.location.protocol}//${window.location.host}${Routes.Popout}${Routes.StreamAlerts}/${alertType}`.replace(
        ':channelName',
        channelName,
      );

    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <PageHeading
          description="Utilize stream overlays to let your audience see what’s happening"
          title="Alerts"
        />
        <LayoutBox>
          <div className={styles.textSection}>
            <h2 className={styles.title}>Get started with Alerts</h2>

            <p className={styles.descriptionText}>
              Copy the alert URL and add it as a browser source in your broadcasting
              software. Use the required dimensions for the alert browser source to be
              displayed correctly. After adding, you can adjust the size of the source in
              the canvas and move it to the desired location.
            </p>
          </div>
          <Callout
            message="This feature is still in early stage of development. Let us know how it works!"
            theme="gray"
            type="info"
            variant="bordered"
          />
        </LayoutBox>
        <LayoutBox>
          <Callout
            message="You need to log in to Noice within your broadcasting software for the alerts to work. The easiest way to ensure that is by adding one of the widgets from Stream Manager to your broadcasting software and logging in within that."
            theme="gray"
            type="warning"
            variant="bordered"
          />
          <div className={styles.alertRow}>
            <div className={classNames(styles.textSection, styles.expand)}>
              <h3 className={styles.title}>Card game events</h3>
              <p className={styles.descriptionText}>
                Show Noice Predictions and High Scoring Cards on your stream in a single
                alert box.
              </p>
            </div>
            <div className={styles.textSection}>
              <div className={styles.dimensionsWrapper}>
                <h3 className={styles.descriptionTextBright}>Dimensions</h3>
                <p className={styles.descriptionText}>340x410</p>
              </div>
            </div>
            <Button
              fit="content"
              iconStart={CoreAssets.Icons.Copy}
              size="sm"
              variant="solid"
              onClick={(e) => {
                trackButtonClickEventOnMouseClick(e, section);
                onCopyUrlClick('card-game-events');
              }}
            >
              Copy url
            </Button>
          </div>
          <div className={styles.alertRow}>
            <div className={classNames(styles.textSection, styles.expand)}>
              <h3 className={styles.title}>Channel events</h3>
              <p className={styles.descriptionText}>
                Show Noice Subs, Follows, Purchases etc. on your stream
              </p>
            </div>
            <div className={styles.textSection}>
              <div className={styles.dimensionsWrapper}>
                <h3 className={styles.descriptionTextBright}>Dimensions</h3>
                <p className={styles.descriptionText}>320x140</p>
              </div>
            </div>
            <Button
              fit="content"
              iconStart={CoreAssets.Icons.Copy}
              size="sm"
              variant="solid"
              onClick={(e) => {
                trackButtonClickEventOnMouseClick(e, section);
                onCopyUrlClick('channel-events');
              }}
            >
              Copy url
            </Button>
          </div>
        </LayoutBox>
      </div>
    </div>
  );
}
