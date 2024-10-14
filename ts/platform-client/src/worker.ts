export const createNoiceWorker = (url: string): Worker => {
  const isViteDevServerMode = url.startsWith('/@fs');

  // Vite dev server uses special urls (/@fs/...) because of HMR to load local files.
  // We cannot importScripts with those so in dev mode we use the Worker constructor directly.
  if (isViteDevServerMode) {
    return new Worker(url, { type: 'module' });
  }

  // In prd we want to load workers from the CDN so we use importScripts.
  const objectUrl = URL.createObjectURL(
    new Blob(['importScripts(' + JSON.stringify(url) + ');'], {
      type: 'application/javascript',
    }),
  );
  const worker = new Worker(objectUrl);
  URL.revokeObjectURL(objectUrl);

  return worker;
};
