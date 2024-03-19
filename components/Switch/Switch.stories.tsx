import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    isLoading: false,
    label: 'Show online status',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description:
        'The label to be associated with the switch, can be a component or a string.',
      required: true,
    },
    description: {
      control: { type: 'text' },
      description: 'The description to be associated with the checkbox.',
    },
    labelType: {
      control: { type: 'select' },
      defaultValue: 'visible',
      description: 'Whether or not to show the label.',
      options: ['hidden', 'visible'],
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether or not the radio button is checked.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether or not the switch is disabled.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A Switch component used for toggling between an on and off state in the UI. The Switch renders a checkbox under the hood, and accepts a HTMLInputElement's props. ref. It can be used in a controlled or uncontrolled state by passing in either \`checked\` or \`defaultChecked\` props.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `The Switch supports a loading state in both the on and off states. The loading state is communicated to assistive technologies by setting \`aria-busy\` on the \`input\` element.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Switch {...args} />
        <Switch
          {...args}
          checked
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
        story: `The Switch supports disabled state that also visually indicates the disabled state on both checked or non-checked states.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Switch {...args} />
        <Switch
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

function SimulateLoading(args: Story['args']) {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleOnClick() {
    setIsLoading(true);

    setTimeout(() => {
      setIsChecked((isChecked) => !isChecked);
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Switch
        {...args}
        checked={isChecked}
        isLoading={isLoading}
        label="Show online status"
        onClick={handleOnClick}
      />
    </div>
  );
}

export const LoadingInAction: Story = {
  args: {
    labelType: 'hidden',
  },
  parameters: {
    docs: {
      description: {
        story: `This story simulates toggling the Switch with an API call. On click, we set \`isLoading\` to \`true\` and then after 2 seconds, we set \`isLoading\` to \`false\` and toggle the \`checked\` state.`,
      },
    },
  },
  render: ({ ...args }) => <SimulateLoading {...args} />,
};
