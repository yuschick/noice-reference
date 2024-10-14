import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { links } from '@constants/links';
import { IconAssets } from '@utils/icons';
import { openURL } from '@utils/open-url';

const externalUrlLinkIcon = (
  <IconAssets.LinkExternal
    color="white"
    height={24}
    width={24}
  />
);

const discordLinkIcon = (
  <IconAssets.Discord
    color="white"
    height={24}
    width={24}
  />
);

export const HelpAndLegalView = () => {
  const openGuides = () => {
    openURL(links.guides);
  };

  const openNoiceDiscord = () => {
    openURL(links.discord);
  };

  const openCommunityGuidelines = () => {
    openURL(links.communityGuidelines);
  };

  const openPrivacyPolicy = () => {
    openURL(links.privacyPolicy);
  };

  const openTermsOfService = () => {
    openURL(links.termsOfService);
  };

  return (
    <PageLayout title="Help and Legal">
      <Gutter height={32} />
      <ButtonLarge.List>
        <ButtonLarge
          backgroundColor="violet600"
          iconElement={externalUrlLinkIcon}
          onPress={openGuides}
        >
          Guides
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          iconElement={discordLinkIcon}
          onPress={openNoiceDiscord}
        >
          Noice Discord
        </ButtonLarge>
      </ButtonLarge.List>
      <Gutter height={16} />
      <ButtonLarge.List>
        <ButtonLarge
          backgroundColor="violet600"
          iconElement={externalUrlLinkIcon}
          onPress={openCommunityGuidelines}
        >
          Community Guidelines
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          iconElement={externalUrlLinkIcon}
          onPress={openPrivacyPolicy}
        >
          Privacy Policy
        </ButtonLarge>
        <ButtonLarge
          backgroundColor="violet600"
          iconElement={externalUrlLinkIcon}
          onPress={openTermsOfService}
        >
          Terms of Service
        </ButtonLarge>
      </ButtonLarge.List>
    </PageLayout>
  );
};
