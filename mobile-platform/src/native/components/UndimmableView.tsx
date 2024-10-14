import { ViewProps, requireNativeComponent } from 'react-native';

const NATIVE_COMPONENT_NAME = 'NoiceUndimmableView';
const NoiceUndimmableView = requireNativeComponent<ViewProps>(NATIVE_COMPONENT_NAME);

export const UndimmableView = ({ children, ...rest }: ViewProps) => (
  <NoiceUndimmableView {...rest}>{children}</NoiceUndimmableView>
);
