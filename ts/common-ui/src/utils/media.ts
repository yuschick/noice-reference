interface Options {
  fileSize: number;
  mb: number;
}

export function validateFileSize(options: Options): boolean {
  const { fileSize, mb } = options;

  // Updated calculation to mimic what's used on the backend to ensure consistent responses
  return fileSize <= mb << 20;
}

export const validateKBFileSize = (options: {
  fileSize: number;
  kb: number;
}): boolean => {
  const { fileSize, kb } = options;

  return fileSize <= kb * 1024;
};
