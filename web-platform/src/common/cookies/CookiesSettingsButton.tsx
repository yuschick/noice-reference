import { useMountEffect } from '@noice-com/common-react-core';
import { Button } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';

import styles from './CookiesSettingsButton.module.css';

interface Props {
  variant?: 'button' | 'link';
  label: string;
}

export function CookiesSettingsButton({ variant = 'button', label }: Props) {
  const userCentricElementRef = useRef(document.getElementById('usercentrics-root'));

  useMountEffect(() => {
    const handleCookiesConsentChangeEvent = (event: WindowEventMap['UC_SDK_EVENT']) => {
      if (
        ['onDenyAllServices', 'onAcceptAllServices', 'onUpdateServices'].some(
          (action) => action === event.detail.action,
        )
      ) {
        // google adsense doesn't send a ping after cookies consent update, so we have to reload the page to get ads as per the cookies settings
        window.location.reload();
        return;
      }
    };

    window.addEventListener('UC_SDK_EVENT', handleCookiesConsentChangeEvent);

    return () => {
      window.removeEventListener('UC_SDK_EVENT', handleCookiesConsentChangeEvent);
    };
  });

  useEffect(() => {
    const userCentricElement = userCentricElementRef.current;

    if (!userCentricElement) {
      return;
    }

    const onScroll = (event: Event) => {
      // Prevent reach scroll lock
      event.stopPropagation();
    };

    userCentricElement.addEventListener('wheel', onScroll);
    userCentricElement.addEventListener('touchmove', onScroll);
    userCentricElement.addEventListener('touchstart', onScroll);

    return () => {
      userCentricElement.removeEventListener('wheel', onScroll);
      userCentricElement.removeEventListener('touchmove', onScroll);
      userCentricElement.removeEventListener('touchstart', onScroll);
    };
  });

  const onClick = window.UC_UI?.showFirstLayer;

  return variant === 'button' ? (
    <Button
      level="secondary"
      size="sm"
      onClick={onClick}
    >
      {label}
    </Button>
  ) : (
    <button
      className={styles.clickableText}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
