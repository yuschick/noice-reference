import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast } from './Toast';

import { Gutter } from '@components/Gutter';
import { useToasts } from '@components/Toast/hooks/useToasts.hook';

export const ToastContainer = () => {
  const { toasts } = useToasts();
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom + 64;

  return (
    <View
      pointerEvents="none"
      style={[
        s.container,
        {
          bottom: bottomOffset,
          top: insets.top,
        },
      ]}
    >
      {toasts.map((toastProps, index) => (
        <Fragment key={toastProps.id}>
          <Toast
            index={index}
            {...toastProps}
          />
          {index !== toasts.length - 1 && <Gutter height={8} />}
        </Fragment>
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    justifyContent: 'flex-end',
  },
});
