import { isReactNativeWebView } from './embeds/bridge';

export const registerServiceWorker = async () => {
  if (
    isReactNativeWebView() ||
    !('serviceWorker' in navigator) ||
    !window.NOICE.FIREBASE_ENABLED
  ) {
    return null;
  }

  const firebaseConfig = {
    apiKey: window.NOICE.FIREBASE_API_KEY,
    authDomain: window.NOICE.FIREBASE_AUTH_DOMAIN,
    projectId: window.NOICE.FIREBASE_PROJECT_ID,
    storageBucket: window.NOICE.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.NOICE.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.NOICE.FIREBASE_APP_ID,
  };

  // @ts-ignore
  const serviceWorkerUrl = new URL('../service-worker.js', import.meta.url);
  const url = serviceWorkerUrl + '?firebaseConfig=' + JSON.stringify(firebaseConfig);

  const reg = await navigator.serviceWorker.register(url);
  navigator.serviceWorker.addEventListener('message', (evt: any) => {
    const payload = evt.data;
    if (!payload.isFirebaseMessaging || payload.messageType !== 'notification-clicked') {
      return;
    }

    const link = payload.notification?.click_action;
    if (link && link !== window.location.href) {
      window.location.assign(link);
    }
  });

  return reg;
};
