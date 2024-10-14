import { PropsWithChildren, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextLayoutEventData,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Gutter } from './Gutter';
import { Typography, TypographyProps } from './Typography';

import { useHitSlop } from '@hooks/useHitSlop.hook';

export const ExpandableTypography = ({
  children,
  numberOfLines,
  ...rest
}: PropsWithChildren<TypographyProps & { maxLines?: number }>) => {
  const [expanded, setExpanded] = useState(false);
  const [requiresExpansion, setRequiresExpansion] = useState(false);
  const [hitSlop, onLayout] = useHitSlop();

  const checkForExpansion = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (numberOfLines && e.nativeEvent.lines.length > numberOfLines) {
      setRequiresExpansion(true);
    }
  };

  return (
    <View>
      {/* hidden text element to calculate length before showing anything */}
      <Typography
        {...rest}
        numberOfLines={undefined}
        style={[rest.style, s.hidden]}
        aria-hidden
        onTextLayout={checkForExpansion}
      >
        {/* strip empty rows to get actual text length */}
        {children?.toString().replace(/\n\s*\n/g, '\n')}
      </Typography>

      <Typography
        ellipsizeMode="clip"
        numberOfLines={expanded ? undefined : numberOfLines}
        selectable
        {...rest}
      >
        {children}
      </Typography>
      <Gutter height={4} />
      {requiresExpansion && (
        <TouchableOpacity
          hitSlop={hitSlop}
          onLayout={onLayout}
          onPress={() => setExpanded(!expanded)}
        >
          <Typography
            color="tealMain"
            fontSize="sm"
            fontWeight="medium"
            style={s.showMore}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  hidden: {
    opacity: 0,
    position: 'absolute',
  },
  showMore: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});
