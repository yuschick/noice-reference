import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Radio } from '@components/Radio/Radio';
import { Typography } from '@components/Typography';
import { useQualityLayers } from '@hooks/useStreamStore.hook';
import { useWebviewStreamStore } from '@hooks/useWebviewStream.hook';

export const qualityLayerEquals = (
  q1: Nullable<QualityLayer>,
  q2: Nullable<QualityLayer>,
): boolean => {
  return (
    q1 !== null &&
    q2 !== null &&
    q1.height === q2.height &&
    q1.width === q2.width &&
    q1.framerate === q2.framerate
  );
};

export const StreamQualitySettingsView = () => {
  const [useWebviewStream, isWebviewTypeLoading] = useBooleanFeatureFlag(
    'mobile_webviewStreamPlayer',
    true,
  );
  const {
    selectedQualityLayer: nativeSelectedQualityLayer,
    qualityLayers: nativeQualityLayers,
    selectQualityLayer: nativeSelectQualityLayer,
  } = useQualityLayers();
  const {
    activeQualityLayer: webSelectedQualityLayer,
    availableQualityLayers: webQualityLayers,
    setQualityLayerAsync: webSelectQualityLayer,
  } = useWebviewStreamStore();

  // These are only needed while we have the feature flag.
  const currentLayer = useMemo(() => {
    if (isWebviewTypeLoading) {
      return null;
    }

    return useWebviewStream ? webSelectedQualityLayer : nativeSelectedQualityLayer;
  }, [
    isWebviewTypeLoading,
    useWebviewStream,
    webSelectedQualityLayer,
    nativeSelectedQualityLayer,
  ]);

  const availableLayers = useMemo(() => {
    if (isWebviewTypeLoading) {
      return [];
    }

    return useWebviewStream ? webQualityLayers : nativeQualityLayers;
  }, [isWebviewTypeLoading, useWebviewStream, webQualityLayers, nativeQualityLayers]);

  const handlePress = (layer: QualityLayer) => {
    // Note: If we have gotten this far, the feature flag has resolved,
    // so we don't have to check it again.
    if (useWebviewStream) {
      webSelectQualityLayer(layer);
    } else {
      nativeSelectQualityLayer(layer);
    }
  };

  return (
    <FormSheetModalLayout>
      <ButtonLarge.List>
        {availableLayers?.map((layer) => (
          <ButtonLarge
            key={`${layer.width}x${layer.height}x${layer.framerate}`}
            onPress={() => handlePress(layer)}
          >
            <View style={s.buttonContent}>
              <Radio selected={qualityLayerEquals(layer, currentLayer)} />
              <Typography
                fontSize="md"
                fontWeight="medium"
                lineHeight="lg"
                numberOfLines={1}
              >
                {layer.height}p
              </Typography>
            </View>
          </ButtonLarge>
        ))}
      </ButtonLarge.List>
    </FormSheetModalLayout>
  );
};

const s = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
});
