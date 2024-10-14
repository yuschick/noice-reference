const fs = require('fs');

const getCachedOutput = async (options, outputCallback) => {
  const { path, cacheMap, cacheEnabled } = options;

  if (!path || !cacheMap) throw new Error('getCachedOutput missing needed args');

  let input = await fs.promises.readFile(path, 'utf8');

  let key = path;
  let value = cacheMap.get(key);

  // If cache enabled check if file content has changed from cache
  // to determine if it needs updating
  const shouldProcessFile = cacheEnabled ? !value || value.input !== input : true;

  let output;
  if (shouldProcessFile) {
    output = await outputCallback();

    // if cache enabled, store it in cache
    if (cacheEnabled) {
      cacheMap.set(key, {
        input,
        output,
      });
    }
  }

  return cacheEnabled ? cacheMap.get(key).output : output;
};

module.exports = {
  getCachedOutput,
};
