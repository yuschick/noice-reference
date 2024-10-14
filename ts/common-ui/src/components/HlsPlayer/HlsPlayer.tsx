import { useClient } from '@noice-com/common-react-core';
import { RecordingError } from '@noice-com/platform-client';
import Hls, {
  PlaylistLoaderContext,
  LoaderConfiguration,
  LoaderCallbacks,
  Events,
  ErrorTypes,
} from 'hls.js';
import { forwardRef, useEffect, useRef } from 'react';

import { useMergeRefs } from '@common-hooks';
import { WithChildren } from '@common-types';

interface HlsPlayerProps {
  channelId: string;
  className?: string;
  streamId: string;
  offset: number;
}

export const HlsPlayer = forwardRef<HTMLVideoElement, WithChildren<HlsPlayerProps>>(
  ({ channelId, streamId, offset, className }, externalRef) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    const ref = useMergeRefs([internalRef, externalRef]);
    const client = useClient();

    useEffect(() => {
      let hls: Hls;
      if (!client) {
        return;
      }

      function initPlayer() {
        if (hls) {
          hls.destroy();
        }

        const newHls = new Hls({
          enableWorker: false,
          startPosition: offset,
          debug: true,
          pLoader: class CustomLoader extends Hls.DefaultConfig.loader {
            public load(
              context: PlaylistLoaderContext,
              _config: LoaderConfiguration,
              callbacks: LoaderCallbacks<PlaylistLoaderContext>,
            ) {
              client.RecordingService.watchRecording(channelId, streamId, 0)
                .then((data) => {
                  callbacks.onSuccess(
                    {
                      url: context.url,
                      data: data,
                    },
                    this.stats,
                    context,
                    null,
                  );
                  return null;
                })
                .catch((error) => {
                  const hlsErr = {
                    code: 500,
                    text: error.message,
                  };
                  if (error instanceof RecordingError) {
                    hlsErr.code = error.status;
                  }

                  callbacks.onError(hlsErr, context, null);
                });
            }
          } as typeof Hls.DefaultConfig.pLoader,
        });

        if (internalRef.current !== null) {
          newHls.attachMedia(internalRef.current);
        }

        newHls.on(Events.MEDIA_ATTACHED, () => {
          newHls.loadSource(`channelId:${channelId}/streamId:${streamId}`);
        });

        newHls.on(Events.MANIFEST_PARSED, () => {
          internalRef?.current?.play();
        });

        newHls.on(Events.ERROR, function (_event, data) {
          if (data.fatal) {
            switch (data.type) {
              case ErrorTypes.NETWORK_ERROR:
                newHls.startLoad();
                break;
              case ErrorTypes.MEDIA_ERROR:
                newHls.recoverMediaError();
                break;
              default:
                initPlayer();
                break;
            }
          }
        });

        hls = newHls;
      }

      // Check for Media Source support
      if (Hls.isSupported()) {
        initPlayer();
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }, [internalRef, channelId, streamId, offset, client]);

    // If Media Source is supported, use HLS.js to play video
    if (Hls.isSupported()) {
      return (
        <video
          className={className}
          ref={ref}
          controls
        />
      );
    }

    return null;
  },
);
