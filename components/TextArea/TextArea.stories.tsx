import { Meta, StoryObj } from "@storybook/react";

import { inputFieldColors } from "../InputField/InputField";

import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: {},
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
    showCharacterCount: {
      control: { type: "boolean" },
      description: "Show the current character count of the field.",
    },
    maxLength: {
      control: { type: "number" },
      description: "Max amount of chars allowed in the field.",
    },
    ref: {
      control: { type: null },
      description:
        "The RefObject<HTMLTextarea> to provide the underlying `<textarea>` element.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The \`TextArea\` component extends the styles and base functionality of the \`InputField\` component. However, the \`TextArea\` allows for multi-line content to be entered. By default, the \`textArea\` will extend to fill the inline axis of its parent. To adjust its block size, provide a \`rows\` value.
        
To view further examples and docs, please visit the [Input Field component docs](/docs/common-ui-input-field--docs).`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    label: "Enter a description",
  },
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: (args) => <TextArea {...args} />,
};

export const ShowCharacterCount: Story = {
  args: {
    label: "Enter a description",
    showCharacterCount: true,
    maxLength: 100,
  },
  parameters: {
    docs: {
      description: {
        story: `The \`TextArea\` component supports showing character count. If max length is also given, the character count displays the current count and the max length.`,
      },
    },
  },
  render: (args) => <TextArea {...args} />,
};

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story: `The \`TextArea\` component supports two color schemes: \`light\` and \`dark\`. The default is \`light\`.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <TextArea
        {...args}
        label="Light textarea (Default)"
        onChange={() => false}
      />
      <TextArea
        {...args}
        theme="blue"
        label="Blue textarea"
        onChange={() => false}
      />
      <TextArea
        {...args}
        theme="gray"
        label="Gray textarea"
        onChange={() => false}
      />
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
        <TextArea
          {...args}
          error={{ message: "The description must be at least 25 characters." }}
          label="Tell us about your experience"
          value="no"
          onChange={() => false}
        />
        <TextArea
          {...args}
          theme="blue"
          error={{ message: "The description must be at least 25 characters." }}
          label="Tell us about your experience"
          value="no"
          onChange={() => false}
        />
        <TextArea
          {...args}
          theme="gray"
          error={{ message: "The description must be at least 25 characters." }}
          label="Tell us about your experience"
          value="no"
          onChange={() => false}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <TextArea
          {...args}
          error={{
            message: "The description must be at least 25 characters.",
            type: "visible",
          }}
          label="Tell us about your experience"
          value="no"
          onChange={() => false}
        />
        <TextArea
          {...args}
          theme="blue"
          error={{
            message: "The description must be at least 25 characters.",
            type: "visible",
          }}
          label="Tell us about your experience"
          value="no"
          onChange={() => false}
        />
        <TextArea
          {...args}
          theme="gray"
          error={{
            message: "The description must be at least 25 characters.",
            type: "visible",
          }}
          label="Tell us about your experience"
          value="no"
          onChange={() => false}
        />
      </div>
    </div>
  ),
};

export const Description: Story = {
  parameters: {
    docs: {
      description: {
        story: `When a field requires additional context, a description is provided. This is useful for things like password requirements or formatting requirements. It will be displayed visually and associated with the textarea for assistive technologies.`,
      },
    },
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <TextArea
        {...args}
        description="The description must be at least 25 characters."
        label="Tell us about your experience"
        onChange={() => false}
      />
      <TextArea
        {...args}
        theme="blue"
        description="The description must be at least 25 characters."
        label="Tell us about your experience"
        onChange={() => false}
      />
      <TextArea
        {...args}
        theme="gray"
        description="The description must be at least 25 characters."
        label="Tell us about your experience"
        onChange={() => false}
      />
    </div>
  ),
};

export const Label: Story = {
  args: {
    label: "Tell us more",
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
        <p>Floating Label</p>
        <TextArea {...args} onChange={() => false} />
        <TextArea {...args} theme="blue" onChange={() => false} />
        <TextArea {...args} theme="gray" onChange={() => false} />
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
        <TextArea {...args} labelType="hidden" onChange={() => false} />
        <TextArea
          {...args}
          theme="blue"
          labelType="hidden"
          onChange={() => false}
        />
        <TextArea
          {...args}
          theme="gray"
          labelType="hidden"
          onChange={() => false}
        />
      </div>
    </>
  ),
};

export const Rows: Story = {
  parameters: {
    docs: {
      description: {
        story: `While the \`TextArea\` will stretch to fill the inline axis of its parent, in order to adjust its block-size, provide a \`rows\` value to the component.
        
When the \`rows\` value is greater than 1, the label will be set in its 'docked' position by default.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        minInlineSize: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <TextArea
        {...args}
        label="Tell us a lot more about your experience"
        rows={10}
        onChange={() => false}
      />
      <TextArea
        {...args}
        theme="blue"
        label="Tell us a lot more about your experience"
        rows={10}
        onChange={() => false}
      />
      <TextArea
        {...args}
        theme="gray"
        label="Tell us a lot more about your experience"
        rows={10}
        onChange={() => false}
      />
    </div>
  ),
};
