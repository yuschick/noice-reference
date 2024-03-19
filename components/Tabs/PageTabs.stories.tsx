import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Tabs } from './Tabs';
import { useTabs } from './useTabs.hook';
import type { Props as UseTabsOptions } from './useTabs.hook';

const meta: Meta<typeof Tabs> = {
  title: 'Tabs / Page Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    store: {
      control: { type: 'object' },
      description: 'The return value from the `useTabs` hook.',
      require: true,
    },
    title: {
      control: { type: 'string' },
      description: 'Associate a descriptive title to the `Tabs` component.',
      require: true,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A Tabs component that can be rendered in different variations. The component runs off of the \`useTabs\` store to ensure that the tabs and panels (content wrapper) can all remain in sync. It can be used in a controlled or uncontrolled state by passing in the \`activeTabIndex\` and \`onChange\` props.

Any content to be rendered when a specific tab is selected should be wrapped in a \`Tabs.Panel\` component. This will ensure that the \`Tabs\` component can properly manage the \`Tabs.TabButton\` and \`Tabs.TabLink\` components. While the panel cannot be styled directly, the content within it can be styled to meet whatever design needs there are.
        
The \`Tabs\` support various accessibility needs such as \`aria-\` associations and keyboard navigation.
        
    const store = useTabs({ variant: 'page' });
      
    return (
      <Tabs
        store={tabs}
        title="Notifications tabs"
      >
        <Tabs.List>
          <Tabs.TabButton>Tab 1</Tabs.TabButton>
          <Tabs.TabButton>Tab 2</Tabs.TabButton>
          <Tabs.TabButton>Tab 3</Tabs.TabButton>
        </Tabs.List>

        <Tabs.Panels>
          <Tabs.Panel>Content 1</Tabs.Panel>
          <Tabs.Panel>Content 2</Tabs.Panel>
          <Tabs.Panel>Content 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    )`,
      },
      viewport: {
        viewports: {
          styles: {
            width: '500px',
          },
        },
      },
    },
  },
};

export default meta;

function CreateTabs(options: UseTabsOptions) {
  const tabs = useTabs(options);

  return (
    <div style={{ inlineSize: '500px' }}>
      <Tabs
        store={tabs}
        title="Page Tabs"
      >
        <Tabs.List>
          <Tabs.TabButton>Tab 1</Tabs.TabButton>
          <Tabs.TabButton>Tab 2</Tabs.TabButton>
          <Tabs.TabButton>Tab 3</Tabs.TabButton>
        </Tabs.List>

        <Tabs.Panels>
          <Tabs.Panel>Content 1</Tabs.Panel>
          <Tabs.Panel>Content 2</Tabs.Panel>
          <Tabs.Panel>Content 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}

function CreateLinkTabs(options: UseTabsOptions) {
  const tabs = useTabs(options);

  return (
    <div style={{ inlineSize: '500px' }}>
      <Tabs
        store={tabs}
        title="Page Tabs"
      >
        <Tabs.List>
          <Tabs.TabButton>Button Tab</Tabs.TabButton>
          <Tabs.TabLink to="/">Link Tab</Tabs.TabLink>
          <Tabs.TabButton>Button Tab</Tabs.TabButton>
        </Tabs.List>

        <Tabs.Panels>
          <Tabs.Panel>Content 1</Tabs.Panel>
          <Tabs.Panel>
            <div>
              Route content should be contained with a <code>Tabs.Panel</code> to ensure
              that the
              <code>Tabs</code> component can properly manages the parent{' '}
              <code>Tabs.TabLink</code>
            </div>
          </Tabs.Panel>
          <Tabs.Panel>Content 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}

function CreateSeparatedTabs(options: UseTabsOptions) {
  const tabs = useTabs(options);

  return (
    <>
      <div style={{ inlineSize: '500px' }}>
        <Tabs
          store={tabs}
          title="Page Tabs"
        >
          <Tabs.List>
            <Tabs.TabButton>Tab 1</Tabs.TabButton>
            <Tabs.TabButton>Tab 2</Tabs.TabButton>
            <Tabs.TabButton>Tab 3</Tabs.TabButton>
          </Tabs.List>
        </Tabs>
      </div>

      <div style={{ inlineSize: '500px' }}>
        <Tabs
          store={tabs}
          title="Separated Tabs"
        >
          <Tabs.Panels>
            <Tabs.Panel>Content 1</Tabs.Panel>
            <Tabs.Panel>Content 2</Tabs.Panel>
            <Tabs.Panel>Content 3</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </>
  );
}

function CreateControlledTabs(options: UseTabsOptions) {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);

  const tabs = useTabs({
    ...options,
    activeTabIndex,
    onChange: (index) => {
      setActiveTabIndex(index);
    },
  });

  return (
    <div style={{ inlineSize: '500px' }}>
      <Tabs
        store={tabs}
        title="Controlled Tabs"
      >
        <Tabs.List>
          <Tabs.TabButton>Tab 1</Tabs.TabButton>
          <Tabs.TabButton>Tab 2</Tabs.TabButton>
          <Tabs.TabButton>Tab 3</Tabs.TabButton>
        </Tabs.List>

        <Tabs.Panels>
          <Tabs.Panel>Content 1</Tabs.Panel>
          <Tabs.Panel>Content 2</Tabs.Panel>
          <Tabs.Panel>Content 3</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}

function CreateKeepMountedTabs(options: UseTabsOptions) {
  const tabs = useTabs(options);

  return (
    <div style={{ inlineSize: '500px' }}>
      <Tabs
        store={tabs}
        title="Page Tabs"
      >
        <Tabs.List>
          <Tabs.TabButton>Keep Mounted</Tabs.TabButton>
          <Tabs.TabButton>Unmount</Tabs.TabButton>
          <Tabs.TabButton>Keep Mounted</Tabs.TabButton>
        </Tabs.List>

        <Tabs.Panels>
          <Tabs.Panel lazyBehavior="keepMounted">
            This panel will remain in the DOM after it selecting a different tab.
          </Tabs.Panel>
          <Tabs.Panel>
            This panel will be removed from the DOM after navigating away from it.
          </Tabs.Panel>
          <Tabs.Panel lazyBehavior="keepMounted">
            This panel will not be rendered into the DOM until it is selected. After
            which, it will remain in the DOM even after selecting another tab.
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  );
}

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `The default usage of the \`Tabs\` component rendered in an uncontrolled state.`,
      },
    },
  },
  render: () => CreateTabs({ variant: 'page' }),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: `Render the \`Tabs\` component in a controlled state by passing in the \`activeTabIndex\` and \`onChange\` props.

  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);
  const tabs = useTabs({
    ...options,
    onChange: (index) => {
      setActiveTabIndex(index);
    },
  });

    <Tabs
      activeTabIndex={activeTabIndex}
      store={tabs}
      title="Controlled Tabs"
    >
      <Tabs.List>
        <Tabs.TabButton>Tab 1</Tabs.TabButton>
        <Tabs.TabButton>Tab 2</Tabs.TabButton>
        <Tabs.TabButton>Tab 3</Tabs.TabButton>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel>Content 1</Tabs.Panel>
        <Tabs.Panel>Content 2</Tabs.Panel>
        <Tabs.Panel>Content 3</Tabs.Panel>
      </Tabs.Panels>
    </Tabs>`,
      },
    },
  },
  render: () => CreateControlledTabs({ variant: 'page' }),
};

export const Split: Story = {
  parameters: {
    docs: {
      description: {
        story: `Because the \`Tabs\` run from the \`store\` result from \`useTabs\`, you can render the \`Tabs.List\` and \`Tabs.Panels\` in different locations. This is useful if you want to render the tabs in a different location in the DOM than the panels.

        const store = useTabs({ variant: 'page' });

    return (
      <>
        <div>
          <Tabs
            store={tabs}
            title="Notifications tabs"
          >
            <Tabs.List>
              <Tabs.TabButton>Tab 1</Tabs.TabButton>
              <Tabs.TabButton>Tab 2</Tabs.TabButton>
              <Tabs.TabButton>Tab 3</Tabs.TabButton>
            </Tabs.List>
          </Tabs>
          </div>

        <div>
          <Tabs
            store={tabs}
            title="Notifications tabs"
          >
            <Tabs.Panels>
              <Tabs.Panel>Content 1</Tabs.Panel>
              <Tabs.Panel>Content 2</Tabs.Panel>
              <Tabs.Panel>Content 3</Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </div>
      </>
    )`,
      },
    },
  },
  render: () => CreateSeparatedTabs({ variant: 'page' }),
};

export const LinksAsTabs: Story = {
  parameters: {
    docs: {
      description: {
        story: `In some instances, a tab will need to link to a new route. The \`Tabs.TabLink\` component can be used to render a \`Link\` component from \`react-router-dom\` and will be managed by the \`Tabs\` component.`,
      },
    },
  },
  render: () => CreateLinkTabs({ variant: 'page' }),
};

export const KeepInactiveTabsMounted: Story = {
  parameters: {
    docs: {
      description: {
        story: `After a tab has been active and its panel shown, that panel can remain mounted in the DOM even after switching to another tab by passing \`lazyBehavior\` to the \`Tabs.Panel\` that should be kept in the DOM. This is ideal in situations where we don't want to fetch and load content again when switching back to a tab. This is also useful for tabs that have a lot of content that would be expensive to load and unload from the DOM.

In the following example, take note of how the panels are handled in the DOM while selecting each tab. The panels for tabs 1 and 3 will remain in the DOM while the panel for tab 2 will be unmounted and mounted again when selecting it.`,
      },
    },
  },
  render: () => CreateKeepMountedTabs({ variant: 'page' }),
};
