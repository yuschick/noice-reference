// eslint-disable-next-line react/jsx-filename-extension
import { StyleProp, ViewStyle, requireNativeComponent } from 'react-native';

export type NoiceStreamViewOrientation = 'portrait' | 'landscape' | 'unset';

type NativeViewProps = {
  style: StyleProp<ViewStyle>;
  forcedOrientation?: NoiceStreamViewOrientation;
  children?: React.ReactNode;
  onContentLayoutChanged: (layoutInfo: any) => void;
  onHeaderLayoutChanged: (layoutInfo: any) => void;
  showOverlay?: boolean;
};

const NativeNoiceStreamView = requireNativeComponent<NativeViewProps>('NoiceStreamView');

export default NativeNoiceStreamView;
