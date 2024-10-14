import { gql } from '@apollo/client';
import { Checkbox, Button, InputField } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';

import styles from './SettingsRestreaming.module.css';

import { useChannelContext } from '@common/channel';
import { PageHeading, LayoutBox, SubHeading } from '@common/layout';
import { SelectableList } from '@common/select';
import {
  UpdateChannelRestreamingConfigMutationVariables,
  useChannelRestreamingConfigQuery,
  useUpdateChannelRestreamingConfigMutation,
} from '@gen';

const RestreamingConfigFragment = gql`
  fragment RestreamingConfigFragment on ChannelRestreamingConfig {
    channelId
    enabled
    rtmpEndpoint
    rtmpKey
    bitrate
    enabled
  }
`;

gql`
  query ChannelRestreamingConfig($channelId: ID!) {
    restreamingConfig(channelId: $channelId) {
      ...RestreamingConfigFragment
    }
  }
  ${RestreamingConfigFragment}
`;

gql`
  mutation UpdateChannelRestreamingConfig(
    $channelId: ID!
    $rtmpEndpoint: String
    $rtmpKey: String
    $bitrate: Int
    $enabled: Boolean
  ) {
    updateRestreamingConfig(
      body: {
        channelId: $channelId
        rtmpEndpoint: $rtmpEndpoint
        rtmpKey: $rtmpKey
        bitrate: $bitrate
        enabled: $enabled
      }
    ) {
      ...RestreamingConfigFragment
    }
  }
  ${RestreamingConfigFragment}
`;

type Bitrate = {
  label: string;
  value: string;
  number: number;
};

const BITRATES: Bitrate[] = [
  { label: '8 Mbps (recommended)', value: '8000', number: 8000 },
  { label: '5 Mbps', value: '5000', number: 5000 },
  { label: '3 Mbps', value: '3000', number: 3000 },
];

export function SettingsRestreaming() {
  const [updateVariables, setUpdateVariables] =
    useState<UpdateChannelRestreamingConfigMutationVariables>({
      channelId: '',
    });

  const { channelId } = useChannelContext();

  useEffect(() => {
    setUpdateVariables((updateVariables) => {
      return {
        ...updateVariables,
        channelId,
      };
    });
  }, [channelId]);

  const { data } = useChannelRestreamingConfigQuery({
    variables: {
      channelId,
    },
  });

  useEffect(() => {
    setUpdateVariables((prev) => ({
      ...prev,
      bitrate: data?.restreamingConfig?.bitrate ?? 8000,
    }));
  }, [data]);

  const [onSave, { loading: savingInProgress }] =
    useUpdateChannelRestreamingConfigMutation({
      variables: updateVariables,
    });

  if (!data?.restreamingConfig) {
    return null;
  }

  const config = {
    ...data.restreamingConfig,
    ...updateVariables,
  };

  const { enabled, rtmpEndpoint, rtmpKey, bitrate } = config;

  return (
    <>
      <PageHeading title="Simulcasting" />

      <section className={styles.section}>
        <SubHeading title="Endpoint" />

        <LayoutBox>
          <div className={styles.content}>
            <Checkbox
              checked={enabled ?? false}
              label="Enabled"
              name="Enabled"
              value="enabled"
              onChange={(event) => {
                setUpdateVariables((prev) => ({
                  ...prev,
                  enabled: event.target.checked,
                }));
              }}
            />

            <InputField
              defaultValue={rtmpEndpoint ?? ''}
              label="RTMP Endpoint"
              theme="gray"
              onChange={(e) => {
                setUpdateVariables((prev) => ({
                  ...prev,
                  rtmpEndpoint: e.target.value,
                }));
              }}
            />

            <InputField
              defaultValue={rtmpKey ?? ''}
              label="RTMP Key"
              theme="gray"
              type="password"
              onChange={(e) => {
                setUpdateVariables((prev) => ({
                  ...prev,
                  rtmpKey: e.target.value,
                }));
              }}
            />
          </div>
        </LayoutBox>
      </section>

      <LayoutBox>
        <SelectableList<string, Bitrate>
          label="Video bitrate"
          options={BITRATES}
          selected={bitrate ? bitrate.toString() : BITRATES[0].value}
          onSelect={(value: Bitrate) => {
            setUpdateVariables((prev) => ({
              ...prev,
              bitrate: value.number,
            }));
          }}
        />
      </LayoutBox>

      <div className={styles.saveButton}>
        <Button
          isDisabled={!validateSettings(config) || savingInProgress}
          size="md"
          variant="cta"
          onClick={() => {
            onSave();
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
}

function validateSettings({
  rtmpEndpoint,
  enabled,
}: UpdateChannelRestreamingConfigMutationVariables): boolean {
  if (enabled && !rtmpEndpoint) {
    return false;
  }

  return true;
}
