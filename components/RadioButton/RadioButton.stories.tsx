import { Meta, StoryObj } from "@storybook/react";

import { RadioButton } from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "Radio Button",
  component: RadioButton,
  tags: ["autodocs"],
  args: {
    label: "Radio Button",
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      defaultValue: "light",
      description: "The color of the radio button.",
      options: ["dark", "light"],
    },
    label: {
      control: { type: "text" },
      description:
        "The label to be associated with the radio button, can be a component or a string.",
      required: true,
    },
    description: {
      control: { type: "text" },
      description: "The description to be associated with the checkbox.",
    },
    labelType: {
      control: { type: "select" },
      defaultValue: "visible",
      description: "Whether or not to show the label.",
      options: ["hidden", "visible"],
    },
    name: {
      control: { type: "text" },
      description:
        "The name of the radio button. This is required to group radio buttons together.",
      required: true,
    },
    checked: {
      control: { type: "boolean" },
      description: "Whether or not the radio button is checked.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether or not the radio button is disabled.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A radio button component for selecting a single option from a list of options. It can be used in a controlled or uncontrolled manner by providing a \`checked\` or \`defaultChecked\` prop. The component accepts a \`ref\` props for an \`HTMLInputElement\` ref object.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {};

export const Color: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <RadioButton theme="dark" label="Dark" name="color" />
        <RadioButton theme="light" label="Dark" name="color" />
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
        story: `The RadioButton supports disabled state that also visually indicates the disabled state on both checked or non-checked states.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <RadioButton {...args} />
        <RadioButton {...args} checked />
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
    labelType: "hidden",
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
    label: "Show online status",
    description:
      "When enabled, your online status will be shown to other users.",
  },
};

export const LabelAsComponent: Story = {
  parameters: {
    docs: {
      descriptions: {
        story:
          "Provide react node as label props, enabling more styling etc. rendering for the label",
      },
    },
  },
  args: {
    label: <span style={{ color: "pink" }}>Label as component</span>,
  },
};

export const RadioGroup: Story = {
  args: {
    labelType: "hidden",
  },
  parameters: {
    docs: {
      description: {
        story: `Provide the same \`name\` prop to multiple radio buttons to group them together.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <RadioButton
            {...args}
            label="Option 1"
            name="radio-group"
            defaultChecked
          />
          <RadioButton {...args} label="Option 2" name="radio-group" />
          <RadioButton {...args} label="Option 3" name="radio-group" />
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <RadioButton
            {...args}
            theme="dark"
            label="Option 1"
            name="radio-group-dark"
            defaultChecked
          />
          <RadioButton
            {...args}
            theme="dark"
            label="Option 2"
            name="radio-group-dark"
          />
          <RadioButton
            {...args}
            theme="dark"
            label="Option 3"
            name="radio-group-dark"
          />
        </div>
      </div>
    );
  },
};
