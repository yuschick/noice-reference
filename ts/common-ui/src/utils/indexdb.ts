export function getIndexedDB(
  name: string,
  version?: number,
  onUpgradeNeeded?: (event: IDBVersionChangeEvent) => void,
): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onerror = (event) => {
      reject(event);
    };

    request.onsuccess = (_) => {
      resolve(request.result);
    };

    if (onUpgradeNeeded) {
      request.onupgradeneeded = onUpgradeNeeded;
    }
  });
}
