export const getOAuthTitle = (clientId: string) => {
  if (clientId === 'nightbot') {
    return 'Nightbot';
  }

  return clientId;
};
