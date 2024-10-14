import { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether or not the checkbox is checked.',
    },
    description: {
      control: { type: 'text' },
      description: 'The description to be associated with the checkbox.',
    },
    direction: {
      control: { type: 'select' },
      defaultValue: 'ltr',
      description:
        'Define whether the input and label should flow from left to right or right to left.',
      options: ['ltr', 'rtl'],
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether or not the checkbox is disabled.',
    },
    label: {
      control: { type: 'text' },
      description:
        'The label to be associated with the checkbox, can be a component or a string.',
      required: true,
    },
    labelType: {
      control: { type: 'select' },
      defaultValue: 'visible',
      description: 'Whether or not to show the label.',
      options: ['hidden', 'visible'],
    },
    name: {
      control: { type: 'text' },
      description:
        'The name of the checkbox. This is required to group checkboxes together.',
      required: true,
    },
    theme: {
      control: { type: 'select' },
      defaultValue: 'light',
      description: 'The color theme of the checkbox.',
      options: ['dark', 'light'],
    },
  },
  args: {
    label: 'Checkbox',
    name: 'checkbox',
  },
  parameters: {
    docs: {
      description: {
        component: ``,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const theme: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Checkbox
          label="Dark"
          name="color"
          theme="dark"
        />
        <Checkbox
          label="Light"
          name="color"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: `The Checkbox supports disabled state that also visually indicates the disabled state on both checked or non-checked states.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Checkbox {...args} />
        <Checkbox
          {...args}
          checked
        />
      </div>
    );
  },
};

export const HideLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: `By default, the label is visible. Set \`labelType\` to \`hidden\` to hide the label.`,
      },
    },
  },
  args: {
    labelType: 'hidden',
  },
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: `Addition to label, optionally a description can be added. The description will be hidden from dom if \`labelType\` is \`hidden\``,
      },
    },
  },
  args: {
    label: 'Show online status',
    description: 'When enabled, your online status will be shown to other users.',
  },
};

export const LabelAsComponent: Story = {
  parameters: {
    docs: {
      descriptions: {
        story:
          'Provide react node as label props, enabling more styling etc. rendering for the label',
      },
    },
  },
  args: {
    label: <span style={{ color: 'pink' }}>Label as component</span>,
  },
};

export const CheckboxGroup: Story = {
  args: {
    labelType: 'hidden',
  },
  parameters: {
    docs: {
      description: {
        story: `Provide the same \`name\` prop to multiple checkboxes to group them together.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Checkbox
            {...args}
            label="Option 1"
            name="checkbox-group"
            defaultChecked
          />
          <Checkbox
            {...args}
            label="Option 2"
            name="checkbox-group"
          />
          <Checkbox
            {...args}
            label="Option 3"
            name="checkbox-group"
          />
        </div>

        <div
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Checkbox
            {...args}
            label="Option 1"
            name="checkbox-group-dark"
            theme="dark"
            defaultChecked
          />
          <Checkbox
            {...args}
            label="Option 2"
            name="checkbox-group-dark"
            theme="dark"
          />
          <Checkbox
            {...args}
            label="Option 3"
            name="checkbox-group-dark"
            theme="dark"
          />
        </div>
      </div>
    );
  },
};
