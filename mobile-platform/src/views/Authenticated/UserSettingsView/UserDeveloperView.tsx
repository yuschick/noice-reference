import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as DeviceInfo from 'react-native-device-info';

import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { useUserDeveloperViewQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { IconAssets } from '@utils/icons';

gql`
  query UserDeveloperView($userId: ID!) {
    userFeatureFlags(userId: $userId) {
      flags {
        name
        value
        revision
      }
    }
  }
`;

export const UserDeveloperView = () => {
  const { userId } = useAuth();

  const { data } = useUserDeveloperViewQuery({
    ...variablesOrSkip({ userId }),
  });

  const [deviceData, setDeviceData] = useState<Map<string, string | number>>();

  useMountEffect(() => {
    (async () => {
      const map = new Map();
      map.set('Device model', DeviceInfo.getModel());
      map.set('Device version', DeviceInfo.getSystemVersion());
      map.set('App version', DeviceInfo.getVersion());
      map.set('Build number', DeviceInfo.getBuildNumber());
      map.set('Zoomed', `${DeviceInfo.isDisplayZoomed()}`);
      map.set('Font scale', await DeviceInfo.getFontScale());
      setDeviceData(map);
    })();
  });

  const copyToClipboard = () => {
    let str = '';

    str += 'Remote feature flags\n\n';
    for (const flag of data?.userFeatureFlags?.flags ?? []) {
      str += `${flag.name}: ${flag.value}\n`;
    }

    str += '\nDevice info\n\n';
    for (const [key, value] of deviceData?.entries() ?? []) {
      str += `${key}: ${value}\n`;
    }

    Clipboard.setString(str);
  };

  return (
    <PageLayout title="Developer stats">
      <TouchableOpacity onPress={copyToClipboard}>
        <HStack
          alignItems="center"
          spacing={8}
        >
          <Typography
            fontSize="xl"
            fontWeight="semiBold"
          >
            Copy stats
          </Typography>
          <IconAssets.Copy
            color="white"
            height={18}
            width={18}
          />
        </HStack>
      </TouchableOpacity>
      <Gutter height={24} />
      <Typography
        fontSize="lg"
        fontWeight="semiBold"
      >
        Remote feature flags
      </Typography>
      <Gutter height={8} />
      {data?.userFeatureFlags?.flags.map((flag) => (
        <>
          <Typography color="textSecondary">
            {flag.name}: <Typography>{flag.value}</Typography>
          </Typography>
          <Gutter height={4} />
        </>
      ))}
      <Gutter height={16} />
      <Typography
        fontSize="lg"
        fontWeight="semiBold"
      >
        Device info
      </Typography>
      <Gutter height={8} />
      {[...(deviceData?.entries() || [])].map(([key, value]) => (
        <>
          <Typography
            color="textSecondary"
            key={`${key}_${value}`}
          >
            {key}: <Typography>{value}</Typography>
          </Typography>
          <Gutter height={4} />
        </>
      ))}
    </PageLayout>
  );
};
