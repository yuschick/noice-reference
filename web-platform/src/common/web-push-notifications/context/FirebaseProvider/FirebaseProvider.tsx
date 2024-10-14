import { useMountEffect } from '@noice-com/common-react-core';
import { WithChildren } from '@noice-com/common-ui';
import { Nullable, repromise } from '@noice-com/utils';
import type { FirebaseApp } from 'firebase/app';
import { createContext, useContext, useState } from 'react';

interface Context {
  firebaseApp: Nullable<FirebaseApp>;
}

const FirebaseContext = createContext<Context | null>(null);
const firebasePromise = repromise(() => import('firebase/app'));

export function FirebaseProvider({ children }: WithChildren) {
  const [app, setApp] = useState<Nullable<FirebaseApp>>(null);

  useMountEffect(() => {
    if (!NOICE.FIREBASE_ENABLED || app) {
      return;
    }

    const init = async () => {
      const { initializeApp } = await firebasePromise;

      const firebaseConfig = {
        apiKey: NOICE.FIREBASE_API_KEY,
        authDomain: NOICE.FIREBASE_AUTH_DOMAIN,
        projectId: NOICE.FIREBASE_PROJECT_ID,
        storageBucket: NOICE.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: NOICE.FIREBASE_MESSAGING_SENDER_ID,
        appId: NOICE.FIREBASE_APP_ID,
      };

      setApp(initializeApp(firebaseConfig));
    };

    init();
  });

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp: app,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase(): Context {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error('Trying to access context without FirebaseContext');
  }

  return context;
}
