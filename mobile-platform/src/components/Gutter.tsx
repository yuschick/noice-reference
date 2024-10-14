import { View } from 'react-native';

interface Props {
  width?: number;
  height?: number;
}

export const Gutter = ({ width, height }: Props) => {
  return <View style={{ width, height }} />;
};
