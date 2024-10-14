import * as styles from './StoreEmbed.module.css';

import { ImplicitAccountUpSellingProvider } from '@common/implicit-account';
import { StreamGameProxyProvider } from '@common/stream';
import { SelectedUIStateProvider } from '@context';
import { Store } from '@pages/Store/Store';

export function StoreEmbed() {
  return (
    <SelectedUIStateProvider>
      <StreamGameProxyProvider>
        <ImplicitAccountUpSellingProvider>
          <div className={styles.container}>
            <Store />
          </div>
        </ImplicitAccountUpSellingProvider>
      </StreamGameProxyProvider>
    </SelectedUIStateProvider>
  );
}
