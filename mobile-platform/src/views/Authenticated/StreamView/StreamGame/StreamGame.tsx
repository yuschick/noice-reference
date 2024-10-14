import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { StreamGameLoadingView } from './StreamGameLoadingView';

import { BridgedWebview } from '@components/BridgedWebview';
import { colors } from '@constants/styles';

type Props = {
  streamId: string;
};

export function StreamGame({ streamId }: Props) {
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  return (
    <>
      {!webviewLoaded && <StreamGameLoadingView />}
      <BridgedWebview
        bounces={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        style={[s.webview, !webviewLoaded && s.webviewOpacity]}
        webviewSource={`embed/game/${streamId}?`}
        mediaPlaybackRequiresUserAction
        onWebViewPageLoaded={setWebviewLoaded}
      />
    </>
  );
}

const s = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.transparent,
  },
  webviewOpacity: {
    opacity: 0,
  },
});
