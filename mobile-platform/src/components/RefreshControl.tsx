import { RefreshControlProps, View } from 'react-native';

import LoadingSpinner from './LoadingSpinner';

/** WIP, not finished yet, leaving it here for now to finish up on another PR
 * Custom Noice RefreshIdicator with the same props but different spinner
 */

export const RefreshControl = ({ refreshing }: RefreshControlProps) => {
  return <View>{refreshing && <LoadingSpinner />}</View>;
};
