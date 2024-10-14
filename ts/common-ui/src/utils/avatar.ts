import { getIndexedDB } from './indexdb';

const VERSION = 1;

let cachedBlobURI: string | null = null;
let indexDBPromise: Promise<IDBDatabase> | null = null;
let subscribers: ((url: string) => void)[] = [];

function createObjectStore(db: IDBDatabase) {
  if (!db.objectStoreNames.contains('avatar')) {
    db.createObjectStore('avatar');
  }
}

async function getDB() {
  if (!indexDBPromise) {
    indexDBPromise = getIndexedDB(
      'avatar_override',
      VERSION,
      (event: IDBVersionChangeEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = (event?.target as any as { result: IDBDatabase }).result;
        createObjectStore(db);
      },
    );
  }

  const db = await indexDBPromise;
  createObjectStore(db);

  return db;
}

export async function setAvatarOverride(avatar: Blob): Promise<void> {
  if (cachedBlobURI) {
    URL.revokeObjectURL(cachedBlobURI);
  }

  cachedBlobURI = URL.createObjectURL(avatar);

  for (const subscriber of subscribers) {
    subscriber(cachedBlobURI);
  }

  const db = await getDB();

  const request = db
    .transaction(['avatar'], 'readwrite')
    .objectStore('avatar')
    .put(avatar, 'avatar');
  await new Promise((resolve, reject) => {
    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (event) => {
      resolve(event);
    };
  });

  return;
}

async function getAvatarOverrideFromStore(): Promise<Blob> {
  const db = await getDB();

  const request = db
    .transaction(['avatar'], 'readwrite')
    .objectStore('avatar')
    .get('avatar');

  return new Promise<Blob>((resolve, reject) => {
    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export async function resetAvatarOverride(): Promise<void> {
  const db = await getDB();

  const request = db
    .transaction(['avatar'], 'readwrite')
    .objectStore('avatar')
    .delete('avatar');
  await new Promise((resolve, reject) => {
    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (event) => {
      resolve(event);
    };
  });

  return;
}

export async function getAvatarOverride(): Promise<string | null> {
  if (cachedBlobURI) {
    return cachedBlobURI;
  }

  try {
    const blob = await getAvatarOverrideFromStore();
    cachedBlobURI = URL.createObjectURL(blob);
    return cachedBlobURI;
  } catch (e) {
    return null;
  }
}

export function addAvatarOverrideListener(callback: (url: string) => void): () => void {
  subscribers.push(callback);

  return () => {
    subscribers = subscribers.filter((subscriber) => subscriber !== callback);
  };
}
