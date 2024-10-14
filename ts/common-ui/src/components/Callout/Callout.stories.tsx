import { CoreAssets } from '@noice-com/assets-core';
import { Meta, StoryObj } from '@storybook/react';

import { Anchor } from '../Anchor';
import { Button } from '../Button';
import { ButtonLink } from '../ButtonLink';

import { Callout, calloutThemes, calloutTypes, calloutVariants } from './Callout';

const meta: Meta<typeof Callout> = {
  title: 'Callout',
  component: Callout,
  tags: ['autodocs'],
  args: {
    message: 'Your business account was created! Apply to the Verified Creator Program',
    type: 'info',
  },
  argTypes: {
    onDismiss: {
      description: 'Callback when the callout is dismissed',
    },
    isLive: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
      description: 'Whether the callout is live or not',
    },
    message: {
      control: {
        type: 'text',
      },
      description: 'The message to display.',
      required: true,
    },
    slots: {
      actions: {
        primary: {
          description: 'Slot for the primary action',
        },
        secondary: {
          description: 'Slot for the secondary action',
        },
      },
      icon: {
        description: 'Slot for the icon',
        type: {
          name: 'SvgComponent',
        },
      },
    },
    ref: {
      description: 'React ref to the wrapping `HTMLDivElement`',
    },
    theme: {
      control: {
        options: calloutThemes,
        type: 'select',
      },
      defaultValue: 'type',
      description: 'The theme to use for the callout.',
    },
    type: {
      control: {
        options: calloutTypes,
        type: 'select',
      },
      description: 'The type of callout to display.',
      required: true,
    },
    variant: {
      control: {
        options: calloutVariants,
        type: 'select',
      },
      defaultValue: 'filled',
      description: 'The variant of the callout.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Callout is an inline banner displaying short messages with helpful information for a task on the page, or something that requires the user's attention.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Callout>;

export const Default: Story = {};

export const IsLive: Story = {
  args: {
    type: 'error',
    isLive: true,
    theme: 'gray',
    variant: 'bordered',
    message: 'We were unable to process your payment. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: `When the callout is live, as in a refresh is not required for it to appear, ensure this prop is true so that screen readers will announce the message`,
      },
    },
  },
  render: (args) => {
    return <Callout {...args} />;
  },
};

export const Message: Story = {
  args: {
    message: 'Your business account was created! Apply to the Verified Creator Program',
    type: 'success',
  },
  parameters: {
    docs: {
      description: {
        story: `Provide the message to be displayed within the Callout. This can be either a \`string\` or a \`ReactNode\``,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout {...args} />
        <Callout
          {...args}
          message={
            <div>
              <span>
                This is a custom <code>ReactNode</code> message.{' '}
                <Anchor href="#">Click here to learn more</Anchor>
              </span>
            </div>
          }
        />
      </div>
    );
  },
};

export const Shape: Story = {
  args: {
    type: 'warning',
  },
  parameters: {
    docs: {
      description: {
        story: `Define the overall shape of the callout. The default is \`rounded\`.`,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout {...args} />
        <Callout {...args} />
      </div>
    );
  },
};

export const Slots: Story = {
  args: {
    type: 'info',
    slots: {
      actions: {
        primary: (
          <Button
            size="xs"
            onClick={() => {}}
          >
            Primary
          </Button>
        ),
        secondary: (
          <ButtonLink
            level="secondary"
            size="xs"
            to="#"
          >
            Secondary Link
          </ButtonLink>
        ),
      },
      icon: CoreAssets.Icons.Lock,
    },
  },
  parameters: {
    docs: {
      description: {
        story: `Use the \`slots\` prop to customize the callout's icon and actions. Either one or both actions can be supplied. If either action exists, we will not display the Dismiss button.
        
        slots: {
      actions: {
        primary: (
          <Button
            size="xs"
            onClick={() => {}}
          >
            Primary
          </Button>
        ),
        secondary: (
          <ButtonLink
            level="secondary"
            size="xs"
            to="#"
          >
            Secondary Link
          </ButtonLink>
        ),
      },
      icon: CoreAssets.Icons.Lock,
    }`,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout {...args} />
        <Callout
          {...args}
          slots={{
            icon: CoreAssets.Icons.AppealAccept,
            actions: { primary: args.slots?.actions?.primary },
          }}
          theme="blue"
        />
        <Callout
          {...args}
          slots={{
            icon: undefined,
            actions: args.slots?.actions,
          }}
          theme="gray"
          type="warning"
          variant="bordered"
        />
        <Callout
          message={args.message}
          theme="type"
          type="success"
          onDismiss={() => {}}
        />
      </div>
    );
  },
};

export const Theme: Story = {
  args: {
    type: 'warning',
    theme: 'gray',
    variant: 'bordered',
  },
  parameters: {
    docs: {
      description: {
        story: `Define the theme of the callout. The default is \`type\` which means the theme will be aligned with the color of the defined \`type\`. Otherwise, this can be overwritten by defining a theme other than \`type\`.`,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout {...args} />
        <Callout
          {...args}
          theme="blue"
        />
        <Callout
          {...args}
          theme="type"
        />
      </div>
    );
  },
};

export const Type: Story = {
  args: {
    type: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: `Define the type of callout to display — ${calloutTypes.join(', ')}.`,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout
          {...args}
          message="This is an error callout."
        />
        <Callout
          {...args}
          message="This is an info callout."
          type="info"
        />
        <Callout
          {...args}
          message="This is a success callout."
          type="success"
        />
        <Callout
          {...args}
          message="This is a warning callout."
          type="warning"
        />
      </div>
    );
  },
};

export const Variant: Story = {
  args: {
    type: 'info',
    variant: 'bordered',
  },
  parameters: {
    docs: {
      description: {
        story: `Define the variant of the callout. The default is \`filled\`.`,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout
          {...args}
          theme="gray"
        />
        <Callout
          {...args}
          variant="filled"
        />
      </div>
    );
  },
};

export const OnDismiss: Story = {
  args: {
    type: 'warning',
    onDismiss: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: `Provide a callback to be called when the callout is dismissed. This will likely be tied to a state change on the parent to hide the callout.
        
The dismiss button is optional. To exclude it from the callout, do not provide the \`onDismiss\` prop.`,
      },
    },
  },
  render: (args) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Callout
          {...args}
          theme="blue"
          variant="bordered"
          onDismiss={undefined}
        />
        <Callout {...args} />
      </div>
    );
  },
};
