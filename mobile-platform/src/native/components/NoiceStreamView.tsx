import { Children, isValidElement, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import NativeNoiceStreamView, {
  NoiceStreamViewOrientation,
} from './NativeNoiceStreamView';

type NoiceStreamViewProps = {
  style: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onContentLayoutChanged: (layoutInfo: any) => void;
  onHeaderLayoutChanged: (layoutInfo: any) => void;
  forcedOrientation?: NoiceStreamViewOrientation;
  showOverlay?: boolean;
};

export const NoiceStreamView = ({
  style,
  children,
  forcedOrientation,
  onContentLayoutChanged,
  onHeaderLayoutChanged,
  showOverlay,
}: NoiceStreamViewProps) => {
  const headerChildren: React.ReactNode[] = [];
  const contentChildren: React.ReactNode[] = [];
  const overlayChildren: React.ReactNode[] = [];
  const nativeViewRef = useRef(null);

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === NoiceStreamView.Header) {
      headerChildren.push(child);
    } else if (child.type === NoiceStreamView.Content) {
      contentChildren.push(child);
    } else if (child.type === NoiceStreamView.Overlay) {
      overlayChildren.push(child);
    }
  });

  return (
    <NativeNoiceStreamView
      forcedOrientation={forcedOrientation}
      ref={nativeViewRef}
      showOverlay={showOverlay}
      style={style}
      onContentLayoutChanged={onContentLayoutChanged}
      onHeaderLayoutChanged={onHeaderLayoutChanged}
    >
      <View
        collapsable={false}
        nativeID="NoiceStreamViewHeader"
        style={s.flex}
      >
        {headerChildren}
      </View>
      <View
        collapsable={false}
        nativeID="NoiceStreamViewContent"
        style={s.flex}
      >
        {contentChildren}
      </View>
      <View
        collapsable={false}
        nativeID="NoiceStreamViewOverlay"
        style={s.flex}
      >
        {overlayChildren}
      </View>
    </NativeNoiceStreamView>
  );
};

NoiceStreamView.Header = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <>{children}</>
);

NoiceStreamView.Content = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <>{children}</>
);

NoiceStreamView.Overlay = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <>{children}</>
);

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
