import { Placement } from '@floating-ui/dom';
import { CoreAssets } from '@noice-com/assets-core';
import { Meta, StoryObj } from '@storybook/react';

import { IconButton } from '../IconButton';
import { ProfileImage } from '../ProfileImage';
import { Switch } from '../Switch';

import { PopoverMenu } from './PopoverMenu';
import { usePopoverMenu } from './usePopoverMenu.hook';

import { ProfilePresenceStatus } from '@common-gen';

const meta: Meta<typeof PopoverMenu> = {
  title: 'Popover Menu',
  component: PopoverMenu,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `The PopoverMenu is an overlay component which is rendered in a Portal. Use this component to render a menu of interactive items, such as buttons and anchors. The menu, however, can support custom content as needed. By default, the PopoverMenu will handle all expected keyboard support and aria-related tags to ensure a solid base level of accessibility.
        
To use, first call the <code>usePopoverMenu()</code> hook and pass in the required props. This hook returns the PopoverMenu store, all of its actions and state required to run the component. Importantly, this hook also returns <code>store.state.popoverMenuTriggerRef</code> which must be passed to the trigger button element. Then pass the store into the root <code>PopoverMenu</code> component.

**Note**: Storybook has issues with the existing <code>portal</code> element positioning, so the stories are best viewed individually.

    const store = usePopoverMenu({ placement: 'bottom' });

    return (
      <>
        <IconButton ... ref={store.state.popoverMenuTriggerRef} onClick={store.actions.toggle} />
        <PopoverMenu store={store}> ... </PopoverMenu>;
      </>
    )`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PopoverMenu>;

type Options = {
  placement?: Placement;
  withCustomContent?: boolean;
  withLongContent?: boolean;
};

function CreatePopoverMenu(options?: Options) {
  const store = usePopoverMenu({ placement: options?.placement || 'bottom' });

  const longContent = Array.from({ length: 20 }).map((_, i) => (
    <PopoverMenu.Button
      key={i}
      onClick={() => false}
    >
      Long Content Item
    </PopoverMenu.Button>
  ));

  /* eslint-disable no-console */
  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.Menu}
        label="Open"
        ref={store.state.popoverMenuTriggerRef}
        variant="ghost"
        onClick={store.actions.toggle}
      />

      <PopoverMenu store={store}>
        {options?.withCustomContent && (
          <PopoverMenu.Section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                inlineSize: '100%',
              }}
            >
              <ProfileImage
                profile={{
                  avatars: {
                    avatar2D:
                      'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
                  },
                  userTag: 'Angus McSix',
                  onlineStatus: ProfilePresenceStatus.PresenceStatusOnline,
                }}
              />
              <Switch
                label="Test label"
                labelType="hidden"
                defaultChecked
                onChange={() => false}
              />
            </div>
          </PopoverMenu.Section>
        )}
        <PopoverMenu.Section>
          <PopoverMenu.Button onClick={() => console.log('Button Item 1')}>
            Button Item 1
          </PopoverMenu.Button>
          <PopoverMenu.Button onClick={() => console.log('Button Item 2')}>
            Button Item 2
          </PopoverMenu.Button>
          <PopoverMenu.Link to="/">Link Item 1</PopoverMenu.Link>
          <PopoverMenu.Link to="https://www.google.com">External Link</PopoverMenu.Link>
        </PopoverMenu.Section>
        <PopoverMenu.Divider />
        <PopoverMenu.Section>
          <PopoverMenu.Button
            isDisabled
            onClick={() => console.log('Disabled Button Item 1')}
          >
            Disabled Button Item 1
          </PopoverMenu.Button>
          <PopoverMenu.Link to="/">Link Item 2</PopoverMenu.Link>
          <PopoverMenu.Link
            to="/"
            isDisabled
          >
            Disabled Link Item 1
          </PopoverMenu.Link>
        </PopoverMenu.Section>
        {options?.withLongContent && (
          <>
            <PopoverMenu.Divider />
            <PopoverMenu.Section>{longContent}</PopoverMenu.Section>
          </>
        )}
      </PopoverMenu>
    </>
  );
}

export const Default: Story = {
  render: () => CreatePopoverMenu(),
};

export const WithCustomContent: Story = {
  parameters: {
    docs: {
      description: {
        story: `The PopoverMenu is not limited to the <code>PopoverMenu.Item</code> as its content. While it is not advised to put much UI inside of the PopoverMenu, it is possible to add custom content to the menu.
        
In this example, we add the profile image and a fake privacy toggle button. Automatically, the PopoverMenu will find and register the toggle input so that it is part of the keyboard navigation.

      const store = usePopoverMenu({ placement: 'bottom' });
      
    return (
      <>
        <IconButton ... ref={store.state.popoverMenuTriggerRef} onClick={store.actions.toggle} />

        <PopoverMenu store={store}>
          <PopoverMenu.Section> ...some custom content... </PopoverMenu.Section>
          <PopoverMenu.Divider />
          <PopoverMenu.Section> ... </PopoverMenu.Section>
        </PopoverMenu>
      </>
    )`,
      },
    },
  },
  render: () => CreatePopoverMenu({ withCustomContent: true }),
};

export const PopoverMenuPlacement: Story = {
  parameters: {
    docs: {
      description: {
        story: `The PopoverMenu is positioned using <a href="https://floating-ui.com/">FloatingUI</a> and supports all of the same placements. There is no default placement, and this must be specified when instantiating the <code>usePopoverMenu</code> hook.

      const store = usePopoverMenu({ placement: 'top' });
      
    return (
      <>
        <IconButton ... ref={store.state.popoverMenuTriggerRef} onClick={store.actions.toggle} />

        <PopoverMenu store={store}> ... </PopoverMenu>
      </>
    )`,
      },
    },
  },
  render: () => CreatePopoverMenu({ placement: 'top' }),
};

export const WithLongContent: Story = {
  parameters: {
    docs: {
      description: {
        story: `Although the content within the menu should never need to force internal scrolling, the PopoverMenu has a graceful fallback in the event that the content does become excessive.`,
      },
    },
  },
  render: () => CreatePopoverMenu({ withLongContent: true }),
};
