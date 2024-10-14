import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  LoadingSpinner,
  Button,
  ConfirmDialog,
  useConfirmDialog,
} from '@noice-com/common-ui';

import styles from './EditStreamKey.module.css';

import { PasswordInputWithReveal } from '@common/input';
import { useEditStreamKeyDataQuery, useRefreshStreamKeyMutation } from '@gen';

gql`
  query EditStreamKeyData($channelId: ID!) {
    ingestConfigs(channelId: $channelId) {
      channelId
      configs {
        ingest {
          ... on StreamIngestConfigIngestConfigFTLConfig {
            streamKey
          }
        }
      }
    }
  }
  mutation RefreshStreamKey($channelId: ID!) {
    refreshIngestConfigs(channelId: $channelId) {
      channelId
      configs {
        ingest {
          ... on StreamIngestConfigIngestConfigFTLConfig {
            streamKey
          }
        }
      }
    }
  }
`;

interface EditStreamKeyProps {
  hideLabel?: boolean;
  hideNewStreamKeyGenerationButton?: boolean;
  channelId: string;
}

export function EditStreamKey(props: EditStreamKeyProps) {
  const [refreshStreamKey, { loading: isLoadingRefresh }] = useRefreshStreamKeyMutation();
  const { data, error, loading, refetch } = useEditStreamKeyDataQuery({
    variables: {
      channelId: props.channelId,
    },
  });

  const streamKey = data?.ingestConfigs?.configs?.[0].ingest?.streamKey;

  const handleRefreshStreamKey = async () => {
    await refreshStreamKey({
      variables: {
        channelId: props.channelId,
      },
      onCompleted() {
        refetch();
      },
    });
  };

  const dialog = useConfirmDialog({
    description: `Before generating a new stream key, be aware that doing so will immediately stop the current key from working. In order to stream again, you will need to replace the existing key with the newly generated one.

Are you sure you want to generate a new stream key?`,
    onCancel: () => {},
    onConfirm: handleRefreshStreamKey,
    title: 'Generate a new Stream Key',
  });

  return (
    <>
      <ConfirmDialog store={dialog} />

      {error && <div className={styles.error}>{error.message}</div>}

      {loading ? (
        <div className={styles.loadingWrapper}>
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className={styles.streamKeyContentWrapper}>
          {!props.hideLabel && <h3 className={styles.title}>Stream key</h3>}

          <div className={styles.inputWrapper}>
            <PasswordInputWithReveal
              defaultValue={streamKey}
              key={streamKey}
              label="Stream key"
              theme="gray"
              readOnly
            />
            <div className={styles.buttonContainer}>
              <Button
                iconStart={CoreAssets.Icons.Duplicate}
                size="sm"
                variant="solid"
                onClick={() => {
                  navigator.clipboard.writeText(streamKey || '');
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          {!props.hideNewStreamKeyGenerationButton && (
            <Button
              fit="content"
              isLoading={isLoadingRefresh}
              level="secondary"
              size="sm"
              onClick={dialog.actions.open}
            >
              Generate New Stream Key
            </Button>
          )}
        </div>
      )}
    </>
  );
}
