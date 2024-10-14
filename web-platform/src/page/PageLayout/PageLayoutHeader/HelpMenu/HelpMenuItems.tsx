import { CoreAssets } from '@noice-com/assets-core';
import {
  Breakpoint,
  CommonUtils,
  NoiceSocialMediaLinks,
  NoiceSupportLinks,
  PopoverMenu,
  useAnalytics,
  useZendeskWidgetLauncher,
} from '@noice-com/common-ui';
import { MouseEvent } from 'react';
import { BiMessageRounded } from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';

export function HelpMenuItems() {
  const { trackButtonClickEventOnMouseClick } = useAnalytics();

  const { onButtonClick } = useZendeskWidgetLauncher({
    zE: window.zE,
    showZendesk: NOICE.SHOW_ZENDESK_WIDGET,
  });

  const trackClickEvent = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    trackButtonClickEventOnMouseClick(event, 'help-menu');
  };

  return (
    <>
      <PopoverMenu.Section>
        {NOICE.SHOW_ZENDESK_WIDGET && (
          <PopoverMenu.Button
            data-ftue-anchor="help-menu-leave-us-a-message"
            iconStart={BiMessageRounded}
            onClick={(event) => {
              onButtonClick();
              trackClickEvent(event);
            }}
          >
            <div>Leave Us a Message</div>
          </PopoverMenu.Button>
        )}
        <PopoverMenu.Link
          iconStart={CoreAssets.Icons.LinkExternal}
          to={NoiceSupportLinks.Guides}
          onClick={(event) => {
            trackClickEvent(event);
          }}
        >
          Guides
        </PopoverMenu.Link>
        <PopoverMenu.Link
          iconStart={FaDiscord}
          to={NoiceSocialMediaLinks.Discord}
          onClick={(event) => {
            trackClickEvent(event);
          }}
        >
          Noice Discord
        </PopoverMenu.Link>
      </PopoverMenu.Section>
      <Breakpoint query={`(min-width: ${CommonUtils.getRem(600)})`}>
        <PopoverMenu.Divider />
      </Breakpoint>
      <Breakpoint query={`(max-width: ${CommonUtils.getRem(599)})`}>
        <PopoverMenu.Section />
      </Breakpoint>
      <PopoverMenu.Section>
        <PopoverMenu.Link
          iconStart={CoreAssets.Icons.LinkExternal}
          to={NoiceSupportLinks.CommunityGuidelines}
          onClick={(event) => {
            trackClickEvent(event);
          }}
        >
          Community Guidelines
        </PopoverMenu.Link>
        <PopoverMenu.Link
          iconStart={CoreAssets.Icons.LinkExternal}
          to={NoiceSupportLinks.TermsOfService}
          onClick={(event) => {
            trackClickEvent(event);
          }}
        >
          Terms of Service
        </PopoverMenu.Link>
        <PopoverMenu.Link
          iconStart={CoreAssets.Icons.LinkExternal}
          to={NoiceSupportLinks.PrivacyPolicy}
          onClick={(event) => {
            trackClickEvent(event);
          }}
        >
          Privacy Policy
        </PopoverMenu.Link>
      </PopoverMenu.Section>
      <PopoverMenu.Section>
        <PopoverMenu.Link
          iconStart={CoreAssets.Icons.Info}
          to={NoiceSupportLinks.AboutNoice}
          onClick={(event) => {
            trackClickEvent(event);
          }}
        >
          About Noice
        </PopoverMenu.Link>
      </PopoverMenu.Section>
    </>
  );
}
