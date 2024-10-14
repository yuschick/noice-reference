import { useRoute } from '@react-navigation/native';
import { Fragment, ReactElement } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Gutter } from './Gutter';
import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { borderRadius, colors } from '@constants/styles';
import { Analytics } from '@lib/Analytics';
import { Haptic } from '@utils/haptic';

type ButtonColor = keyof typeof colors;

interface Props extends TouchableOpacityProps {
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: ButtonColor | ButtonColor[];
  textColor?: ButtonColor;
  disabledTextColor?: ButtonColor;
  textAlign?: TextStyle['textAlign'];
  upperCase?: boolean;
  iconElement?: JSX.Element;
  disableHaptic?: boolean;
  activeOpacity?: number;
  rounded?: boolean;
  iconOnRight?: boolean;
  flex?: ViewStyle['flex'];
  analyticsActionName?: string;
}

const ICON_MARGIN = 12;
const DEFAULT_ACTIVE_OPACITY = 0.75;

const textAlignToJustifyContent = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  auto: 'center',
  justify: 'center',
} as const;

/**
 *
 * NOTE: Dependency on useRoute from react-navigation/native means that this component
 * can only be used within a navigator
 */
export const ButtonLarge = ({
  textStyle,
  backgroundColor = 'whiteTransparent10',
  textColor = 'white',
  disabledTextColor = 'whiteTransparent20',
  textAlign = 'center',
  iconElement,
  upperCase = true,
  disableHaptic,
  children,
  activeOpacity = DEFAULT_ACTIVE_OPACITY,
  rounded = true,
  iconOnRight,
  flex = 0,
  analyticsActionName,
  ...rest
}: Props) => {
  const isGradient = Array.isArray(backgroundColor);
  const gradient = isGradient && backgroundColor.map((c) => colors[c]);

  const currentTextColor = !rest.disabled ? textColor : disabledTextColor;
  const route = useRoute();

  const onPressOut = (event: GestureResponderEvent) => {
    if (analyticsActionName) {
      Analytics.trackEvent({
        clientButtonClick: {
          action: analyticsActionName,
          pathname: route.name,
        },
      });
    }

    !disableHaptic && Haptic.impactLight();
    rest?.onPressOut?.(event);
  };

  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={activeOpacity}
      style={[
        s.container,
        rounded && s.rounded,
        !isGradient && { backgroundColor: colors[backgroundColor] },
        { flex },
        rest.style,
        rest.disabled && s.disabled,
      ]}
      onPressOut={onPressOut}
    >
      {gradient && !rest.disabled && (
        <LinearGradient
          colors={gradient}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
      )}
      <HStack
        alignItems="center"
        justifyContent={textAlignToJustifyContent[textAlign]}
        style={[s.flex, iconOnRight && s.iconOnRight]}
      >
        {iconElement && (
          <View style={iconOnRight ? s.iconRight : s.iconLeft}>{iconElement}</View>
        )}
        {typeof children === 'string' ? (
          <Typography
            color={currentTextColor}
            fontSize="md"
            fontWeight="medium"
            lineHeight="lg"
            numberOfLines={1}
            style={textStyle}
            textAlign={textAlign}
            uppercase={upperCase}
          >
            {children}
          </Typography>
        ) : (
          children
        )}
      </HStack>
    </TouchableOpacity>
  );
};

ButtonLarge.List = ({ children }: { children: ReactElement<typeof ButtonLarge>[] }) => {
  const buttons = children.map((child, i, arr) => {
    if (child.type !== ButtonLarge) {
      return null;
    }

    return (
      <Fragment key={'button-list-' + i + '-' + child.key}>
        <ButtonLarge
          {...child.props}
          style={s.listButtonContainer}
          textAlign={'left'}
        />
        {i !== arr.length && <Gutter height={1} />}
      </Fragment>
    );
  });

  return <View style={s.buttonList}>{buttons}</View>;
};

const s = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.radiusSm,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: borderRadius.radius2xl,
  },
  buttonList: {
    borderRadius: borderRadius.radiusSm,
    overflow: 'hidden',
  },
  listButtonContainer: {
    borderRadius: 0,
  },
  disabled: {
    backgroundColor: colors.whiteTransparent05,
  },
  flex: {
    flex: 1,
  },
  iconLeft: {
    marginRight: ICON_MARGIN,
  },
  iconRight: {
    marginLeft: ICON_MARGIN,
  },
  iconOnRight: {
    flexDirection: 'row-reverse',
  },
});
