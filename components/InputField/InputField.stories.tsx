import { CoreAssets } from "@noice-com/assets-core";
import { Meta, StoryObj } from "@storybook/react";

import { Icon } from "../Icon";

import { InputField, inputFieldColors } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Input Field",
  component: InputField,
  tags: ["autodocs"],
  args: {
    size: "lg",
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      defaultValue: "light",
      description:
        "Provide the color scheme for the input. Defaults to 'light'.",
      options: inputFieldColors,
    },
    error: {
      control: { type: "object" },
      description: `When the field is invalid, provide a message to describe the error. This message will be announced to assistive technologies and trigger the invalid UI styles for the component.`,
    },
    isDisabled: {
      control: { type: "boolean" },
      description:
        "Mark the field as disabled. This should only ever happen when a form is submitting. Otherwise, if the field should be rendered without the ability to edit, either display the value is raw text, or use the input in `readonly` mode.",
    },
    readOnly: {
      control: { type: "boolean" },
      description:
        "Mark the field as read-only. This should only ever happen when a form is submitting. Otherwise, if the field should be rendered without the ability to edit, either display the value is raw text, or use the input in `readonly` mode.",
    },
    ref: {
      control: { type: null },
      description:
        "The RefObject<HTMLInputElement> to provide the underlying `<input>` element.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The \`InputField\` component is a wrapper around the \`<input>\` element. It provides a consistent look and feel for all inputs in the application. It also provides a consistent way to display hints, display interactive slots and associate errors with assistive technologies. It will fill the inline-axis of its parent container, and can be sized by styling its parent.
        
The component supports any valid HTML input type. It also supports \`slots\` for \`inputStart\` and \`inputEnd\` to allow for interactive elements to be placed 'inside' the input. This is useful for things like a clear button or a password toggle.

The \`InputField\` can be used in either a controlled or uncontrolled manner. If you provide a \`value\` prop, the component will be controlled. If you do not provide a \`value\` prop, the component will be uncontrolled. If you provide a \`defaultValue\` prop, the component will be uncontrolled, but will be initialized with the provided value. If you provide a \`value\` prop, you must also provide an \`onChange\` handler to update the value. If you do not provide a \`value\` prop, you must provide an \`onInput\` handler to update the value.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Default input",
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <InputField {...args} label="Light input (Default)" />
      <InputField {...args} theme="blue" label="Blue input" />
      <InputField {...args} theme="gray" label="Gray input" />
    </div>
  ),
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: `In order to mark the field as invalid, provide an \`error\` prop. There are two properties to \`error\`, \`error.message\` and \`error.type\`. Provide a \`message\` to be rendered and announced to assistive technologies. Provide a \`type\` to determine whether the \`message\` should be \`hidden\` or \`visible\`. The default is \`hidden\`.
        
Additionally, if a field is invalid, focus will be moved to it. If there are multiple invalid fields, focus will be returned to the first invalid component.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <InputField
          {...args}
          error={{ message: "The email address is not a valid format." }}
          label="Light input (Default)"
          value="look@you"
        />
        <InputField
          {...args}
          theme="blue"
          error={{ message: "The email address is not a valid format." }}
          label="Blue input"
          value="look@you"
        />
        <InputField
          {...args}
          theme="gray"
          error={{ message: "The email address is not a valid format." }}
          label="Gray input"
          value="look@you"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <InputField
          {...args}
          error={{
            message: "The email address is not a valid format.",
            type: "visible",
          }}
          label="Light input (Default)"
          value="look@you"
        />
        <InputField
          {...args}
          theme="blue"
          error={{
            message: "The email address is not a valid format.",
            type: "visible",
          }}
          label="Blue input"
          value="look@you"
        />
        <InputField
          {...args}
          theme="gray"
          error={{
            message: "The email address is not a valid format.",
            type: "visible",
          }}
          label="Gray input"
          value="look@you"
        />
        <InputField
          {...args}
          theme="gray"
          defaultValue="look@you."
          label="Native error"
          type="email"
        />
      </div>
    </div>
  ),
};

export const Description: Story = {
  parameters: {
    docs: {
      description: {
        story: `When a field requires additional context, a description is provided. This is useful for things like password requirements or formatting requirements. It will be displayed visually and associated with the input field for assistive technologies.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <InputField
        {...args}
        description="Must be at least 8 characters long."
        label="With hint"
      />
      <InputField
        {...args}
        theme="blue"
        description="This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines."
        label="With hint"
      />
      <InputField
        {...args}
        theme="gray"
        description="This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines. This is a super long hint that will wrap to multiple lines."
        label="With hint"
      />
    </div>
  ),
};

export const Label: Story = {
  args: {
    label: "First name",
  },
  parameters: {
    docs: {
      description: {
        story: `Provide a label to be used visually and associated with the input field for assistive technologies. The label can have a \`labelType\` of either 'floating (default)' or 'hidden'.`,
      },
      required: true,
    },
  },
  render: (args) => (
    <>
      <div
        style={{
          color: "var(--noi-color-text-dark",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBlockEnd: "1rem",
        }}
      >
        <InputField {...args} />
        <InputField {...args} theme="blue" />
        <InputField {...args} theme="gray" />
      </div>

      <div
        style={{
          color: "var(--noi-color-text-dark",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <p>Hidden Label</p>
        <InputField {...args} labelType="hidden" />
        <InputField {...args} theme="blue" labelType="hidden" />
        <InputField {...args} theme="gray" labelType="hidden" />
      </div>
    </>
  ),
};

const SlotButton = ({
  iconColor,
}: {
  iconColor: (typeof inputFieldColors)[number];
}) => (
  <button
    aria-label="Non-functional demo button"
    style={{
      backgroundColor: "transparent",
      inlineSize: "100%",
      borderRadius: "var(--noi-border-radius-circle)",
      padding: 0,
      display: "grid",
      placeItems: "center",
    }}
    type="button"
    onClick={() => false}
  >
    <Icon color={`${iconColor}-main`} icon={CoreAssets.Icons.Exclamation} />
  </button>
);

export const Slots: Story = {
  parameters: {
    docs: {
      description: {
        story: `The \`InputField\` component supports two slots: \`inputStart\` and \`inputEnd\`. These slots allow for interactive elements to be placed 'inside' the input. This is useful for things like a clear button or a password toggle.`,
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <InputField
        label="Slots InputStart"
        size="lg"
        slots={{
          inputStart: <SlotButton iconColor="blue" />,
        }}
      />
      <InputField
        theme="blue"
        label="Slots InputEnd"
        size="lg"
        slots={{
          inputEnd: <SlotButton iconColor="light" />,
        }}
        type="password"
      />
      <InputField
        theme="gray"
        label="Slots Both"
        size="lg"
        slots={{
          inputEnd: <SlotButton iconColor="light" />,
          inputStart: <SlotButton iconColor="light" />,
        }}
      />
    </div>
  ),
};
