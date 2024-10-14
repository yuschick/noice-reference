import { FontSizeSelector } from '@noice-com/common-ui';

import styles from './ChatFontSizeSettings.module.css';

import { useChatSettings } from '@chat-common/settings';

export function ChatFontSizeSettings() {
  const { fontSize, setFontSize } = useChatSettings();

  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.fontSizeContentWrapper}>
        <legend className={styles.legend}>Font size</legend>

        <FontSizeSelector
          fontSize={fontSize}
          setFontSize={setFontSize}
          title="Chat"
        />
      </div>
    </fieldset>
  );
}
