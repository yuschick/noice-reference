export const getChannelNameFromPath = (path: string) =>
  path.substring(
    // Remove the first `/`
    1,
    // Remove the query string if it exists
    path.lastIndexOf('?') > 0 ? path.lastIndexOf('?') : path.length,
  );
