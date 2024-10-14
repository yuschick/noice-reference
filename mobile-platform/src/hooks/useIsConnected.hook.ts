import { useNetInfo } from '@react-native-community/netinfo';

export const useIsConnected = () => {
  const { isConnected } = useNetInfo();

  // isConnected can be null as well if network is unrecognized
  // in that case we might still have internet so monitor only explicitly not connected state
  return !(isConnected === false);
};
