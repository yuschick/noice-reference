import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { HStack } from './Stack/HStack';
import { Typography } from './Typography';

import { borderRadius, colors } from '@constants/styles';

interface Props {
  label: string;
  color: keyof typeof colors | (keyof typeof colors)[];
  uppercase?: boolean;
  icon?: React.ReactNode;
}

export function PillLabel({ label, color, uppercase, icon }: Props) {
  const isGradient = Array.isArray(color);
  const containerStyles = [
    s.container,
    icon ? s.withIcon : null,
    {
      backgroundColor: !isGradient ? colors[color] : undefined,
    },
  ];

  const gradient = useMemo(() => {
    if (!isGradient) {
      return [];
    }

    return color.map((c) => colors[c]);
  }, [color, isGradient]);

  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      spacing={4}
      style={containerStyles}
    >
      {isGradient && (
        <LinearGradient
          colors={gradient}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={s.gradient}
        />
      )}
      <Typography
        color="white"
        fontSize="sm"
        fontWeight="semiBold"
        style={{
          fontVariant: ['tabular-nums'],
        }}
        uppercase={uppercase}
      >
        {label}
      </Typography>
      {icon}
    </HStack>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.radiusSm,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius.radiusSm,
  },
  withIcon: {
    paddingRight: 8,
  },
});
