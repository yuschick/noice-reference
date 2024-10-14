jest.mock('react-native-ios-context-menu', () => {
  const RN = jest.requireActual('react-native');

  return {
    RCTContextMenuView: () => RN.View,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ContextMenuButton: 'TouchableOpacity',
  };
});
