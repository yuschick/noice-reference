import * as styles from './SeasonsEmbed.module.css';

import { SelectedUIStateProvider } from '@context';
import { Seasons } from '@pages/Seasons';

export function SeasonsEmbed() {
  return (
    <SelectedUIStateProvider>
      <div className={styles.container}>
        <Seasons />
      </div>
    </SelectedUIStateProvider>
  );
}
