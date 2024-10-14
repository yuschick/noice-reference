import { Meta, StoryObj } from '@storybook/react';

import { Select, SelectOption, selectColors } from './Select';

const optionList = ['Dog', 'Cat', 'Hamster', 'Parrot', 'Spider', 'Goldfish'];

const options = optionList.map<SelectOption>((option) => ({
  type: 'option',
  value: option,
  label: option,
}));

const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    selectSize: 'lg',
    options: options,
  },
  argTypes: {
    options: {
      control: { type: 'array' },
      description:
        'Provide the options for the select. It can either string array or Array<{ value: string; label: string; }>, where `label` is the printed value and `value` is the value on `onChange`.',
    },
    color: {
      control: { type: 'select' },
      defaultValue: 'light',
      description: "Provide the color scheme for the select. Defaults to 'light'.",
      options: selectColors,
    },
    errorMsg: {
      control: { type: 'text' },
      description: `When the field is invalid, provide a message to describe the error. This message will be announced to assistive technologies and trigger the invalid UI styles for the component.`,
    },
    isDisabled: {
      control: { type: 'boolean' },
      description:
        'Mark the field as disabled. This should only ever happen when a form is submitting. Otherwise, if the field should be rendered without the ability to edit, either display the value is raw text, or use the select in `readonly` mode.',
    },
    ref: {
      control: { type: null },
      description:
        'The RefObject<HTMLInputElement> to provide the underlying `<select>` element.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The \`Select\` component is a wrapper around the \`<select>\` element. It provides a consistent look and feel for all selects in the application. It also provides a consistent way to display hints and associate errors with assistive technologies. It will fill the inline-axis of its parent container, and can be sized by styling its parent.

The \`Select\` can be used in either a controlled or uncontrolled manner. If you provide a \`value\` prop, the component will be controlled. If you do not provide a \`value\` prop, the component will be uncontrolled. If you provide a \`defaultValue\` prop, the component will be uncontrolled, but will be initialized with the provided value. If you provide a \`value\` prop, you must also provide an \`onChange\` handler to update the value. If you do not provide a \`value\` prop, you must provide an \`onInput\` handler to update the value.`,
      },
      controls: { exclude: ['selectSize'] },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Default select',
  },
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: `The \`InputField\` component supports two color schemes: \`light\` and \`dark\`. The default is \`light\`.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        {...args}
        label="Light select (Default)"
      />
      <Select
        {...args}
        color="blue"
        label="Blue select"
      />
      <Select
        {...args}
        color="gray"
        label="Gray select"
      />
    </div>
  ),
};

export const ErrorMsg: Story = {
  parameters: {
    docs: {
      description: {
        story: `In order to mark the field as invalid, provide an \`errorMsg\` prop. While not visually displayed, the message will be announced to assistive technologies and trigger the invalid UI styles for the component. 
        
Additionally, if a field is invalid, focus will be moved to it. If there are multiple invalid fields, focus will be returned to the first invalid component.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        {...args}
        errorMsg="The email address is not a valid format."
        label="Light select (Default)"
        value="look@you"
      />
      <Select
        {...args}
        color="blue"
        errorMsg="The email address is not a valid format."
        label="Blue select"
        value="look@you"
      />
      <Select
        {...args}
        color="gray"
        errorMsg="The email address is not a valid format."
        label="Gray select"
        value="look@you"
      />
    </div>
  ),
};

export const Hint: Story = {
  parameters: {
    docs: {
      description: {
        story: `When a field requires additional context, a hint is provided. It will be displayed visually and associated with the select field for assistive technologies.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        {...args}
        description="This will be saved for your preferences what type of emojis you want."
        label="With hint"
      />
      <Select
        {...args}
        color="blue"
        description="This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines."
        label="With hint"
      />
      <Select
        {...args}
        color="gray"
        description="This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines."
        label="With hint"
      />
    </div>
  ),
};

export const Label: Story = {
  args: {
    label: 'Favorite animal',
  },
  parameters: {
    docs: {
      description: {
        story: `Provide a label to be used visually and associated with the select field for assistive technologies. The label can have a \`labelType\` of either 'static (default)' or 'hidden'.`,
      },
      required: true,
    },
  },
  render: (args) => (
    <>
      <div
        style={{
          color: 'var(--noi-color-text-dark',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBlockEnd: '1rem',
        }}
      >
        <Select {...args} />
        <Select
          {...args}
          color="blue"
        />
        <Select
          {...args}
          color="gray"
        />
      </div>

      <div
        style={{
          color: 'var(--noi-color-text-dark',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <p>Hidden Label</p>
        <Select
          {...args}
          labelType="hidden"
        />
        <Select
          {...args}
          color="blue"
          labelType="hidden"
        />
        <Select
          {...args}
          color="gray"
          labelType="hidden"
        />
      </div>
    </>
  ),
};

export const Divider: Story = {
  parameters: {
    docs: {
      description: {
        story: `The \`Select\` component supports dividers. They are used to separate groups of options.`,
      },
    },
  },
  render: (args) => (
    <Select
      {...args}
      options={[
        ...options,
        { type: 'divider' },
        { type: 'option', value: 'Bear', label: 'Bear' },
        { type: 'option', value: 'Lion', label: 'Lion' },
        { type: 'option', value: 'Tiger', label: 'Tiger' },
      ]}
    />
  ),
};
