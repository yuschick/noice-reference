const generatePlatformLink = (path: string) => {
  return `${window.NOICE.PLATFORM_URL}/${path}`;
};

export const generateUserPlatformLink = (username: string) => {
  return generatePlatformLink(`u/${username}`);
};

export const generateChannelPlatformLink = (channelName: string) => {
  return generatePlatformLink(channelName);
};

const generateStudioLink = (path: string) => {
  return `${window.NOICE.STUDIO_URL}/${path}`;
};

export const generateChannelStudioLink = (channelName: string) => {
  return generateStudioLink(channelName);
};
