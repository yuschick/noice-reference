import {
  NoiceSocialMediaLinks,
  NoiceSupportLinks,
  PopoverMenu,
  useZendeskWidgetLauncher,
} from '@noice-com/common-ui';

export function HelpMenuItems() {
  const { onButtonClick } = useZendeskWidgetLauncher({
    zE: window.zE,
    showZendesk: NOICE.SHOW_ZENDESK_WIDGET,
  });

  return (
    <>
      <PopoverMenu.Section>
        {NOICE.SHOW_ZENDESK_WIDGET && (
          <PopoverMenu.Button onClick={onButtonClick}>
            Leave us a message
          </PopoverMenu.Button>
        )}
        <PopoverMenu.Link to={NoiceSupportLinks.Guides}>Guides</PopoverMenu.Link>
        <PopoverMenu.Link to={NoiceSocialMediaLinks.Discord}>
          Noice Discord
        </PopoverMenu.Link>
      </PopoverMenu.Section>
      <PopoverMenu.Section>
        <PopoverMenu.Link to={NoiceSupportLinks.CommunityGuidelines}>
          Community Guidelines
        </PopoverMenu.Link>
        <PopoverMenu.Link to={NoiceSupportLinks.TermsOfService}>
          Terms of Service
        </PopoverMenu.Link>
        <PopoverMenu.Link to={NoiceSupportLinks.PrivacyPolicy}>
          Privacy Policy
        </PopoverMenu.Link>
      </PopoverMenu.Section>
    </>
  );
}
