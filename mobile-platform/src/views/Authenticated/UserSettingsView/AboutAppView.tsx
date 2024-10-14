import { gql } from '@apollo/client';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { links } from '@constants/links';
import { IconAssets } from '@utils/icons';
import { isTestFlightInstall } from '@utils/installer';
import { openURL } from '@utils/open-url';

gql`
  query UserSettingsView($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        roles
      }
    }
  }
`;

export const AboutAppView = () => {
  const openOssLicenses = () => {
    openURL(links.ossLicenses);
  };

  return (
    <PageLayout title="About app">
      <Gutter height={24} />

      <ButtonLarge
        backgroundColor="violet600"
        iconElement={
          <IconAssets.LinkExternal
            color="white"
            height={24}
            width={24}
          />
        }
        rounded={false}
        onPress={openOssLicenses}
      >
        Open Source Licenses
      </ButtonLarge>
      <Gutter height={24} />
      {isTestFlightInstall() && (
        <Typography
          color="textLightSecondary"
          fontSize="sm"
          textAlign="center"
        >
          Version: {getVersion()} ({getBuildNumber()}) TestFlight
        </Typography>
      )}
    </PageLayout>
  );
};
