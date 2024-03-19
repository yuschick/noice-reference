import { Placement as FloatingUIPlacement } from "@floating-ui/dom";
import { CoreAssets } from "@noice-com/assets-core";
import { Meta, StoryObj } from "@storybook/react";

import { IconButton } from "../IconButton";

import { Tooltip } from "./Tooltip";

const placements: FloatingUIPlacement[] = [
  "bottom-end",
  "bottom",
  "bottom-start",
  "left-end",
  "left",
  "left-start",
  "right-end",
  "right",
  "right-start",
  "top-end",
  "top",
  "top-start",
];

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: {
    placement: "bottom",
  },
  argTypes: {
    content: {
      control: "text",
      description: "The content of the tooltip",
      defaultValue: "Tooltip content",
    },
    delay: {
      control: "number",
      description: "The delay time before the tooltip is shown",
      defaultValue: 10,
    },
    distance: {
      control: "number",
      description: "The distance between the tooltip and the trigger",
      defaultValue: 10,
    },
    forceState: {
      control: {
        type: "select",
      },
      options: ["hide", "show"],
      description: "Force the tooltip to hide or show",
    },
    initialState: {
      control: {
        type: "select",
      },
      options: ["hide", "show"],
      description: "The initial state of the tooltip",
    },
    placement: {
      control: {
        type: "select",
      },
      options: placements,
      description: "The placement of the tooltip",
    },
    renderIn: {
      control: {
        type: "select",
      },
      options: ["portals", "inline"],
      description: "The element id of where the tooltip should be rendered.",
      defaultValue: "portals",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `The \`Tooltip\` component is used to display supplemental information for an element on hover or focus. The component can be used to display a single string of text, or more a complex \`ReactNode\`.
        
**Note:** It is not recommended to include interactive elements, such as buttons, within the tooltip. This would likely indicate a need for the [PopoverMenu component](/docs/common-ui-popover-menu--docs) instead.

Several accessibility concerns have been addressed with the component such as — remaining active on hover, not rendering in the DOM until needed and assigning the \`tooltip\` role to the content.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: ``,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content="This is string content. This is string content. This is string content."
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};

export const StyledContent: Story = {
  parameters: {
    docs: {
      description: {
        story: `Provide a \`ReactNode\` to the \`content\` prop to render more complex and/or styled content within the tooltip wrapper.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content={
            <div style={{ padding: "0.5rem 0" }}>
              <h2>This is a heading</h2>
              <p>This is a sentence of body text.</p>
            </div>
          }
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};

export const CustomDelay: Story = {
  args: {
    delay: 1000,
  },
  parameters: {
    docs: {
      description: {
        story: `In some rare instances, the default delay of 10ms may not be sufficient. In these cases, the \`delay\` prop can be used to increase the delay time.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content="This is string content. This is string content. This is string content."
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};

export const CustomDistance: Story = {
  args: {
    distance: 30,
    placement: "right",
  },
  parameters: {
    docs: {
      description: {
        story: `In some instances, the default distance of 10px may not be sufficient. In these cases, the \`distance\` prop can be used to increase the distance between the tooltip and the trigger.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content="This is string content. This is string content. This is string content."
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};

export const ForcedState: Story = {
  args: {
    forceState: "show",
  },
  parameters: {
    docs: {
      description: {
        story: `The \`forceState\` prop can be used to force the tooltip to hide or show and skip setting any event listeners.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content="This is string content. This is string content. This is string content."
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};

export const InitialState: Story = {
  args: {
    initialState: "show",
  },
  parameters: {
    docs: {
      description: {
        story: `The \`initialState\` prop can be used to set the initial state of the tooltip to hide or show. This differs from the \`forceState\` prop in that the tooltip will still set event listeners and respond to user interactions from its initial state.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content="This is string content. This is string content. This is string content."
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};

export const Placement: Story = {
  args: {
    placement: "right",
  },
  parameters: {
    docs: {
      description: {
        story: `The \`placement\` prop can be used to set the placement of the tooltip relative to the trigger. This prop maps to the FLoating UI placement values.`,
      },
    },
  },
  render: () => {
    return (
      <div style={{ padding: "4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {placements.reverse().map((placement) => (
            <Tooltip
              content={`Tooltip placement: ${placement}. This is string content. This is string content. This is string content.`}
              key={placement}
              placement={placement}
            >
              <IconButton
                theme="dark"
                icon={CoreAssets.Icons.Exclamation}
                label="Details"
                onClick={() => {}}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    );
  },
};

export const RenderIn: Story = {
  args: {
    renderIn: "inline",
  },
  parameters: {
    docs: {
      description: {
        story: `The \`renderIn\` prop can be used to set the element id of where the tooltip should be rendered. By default, the tooltip will be rendered in a portal element. However, in some cases such as within dialogs, the tooltip should be rendered inline, next to the trigger. Note: The inline tooltip _may_ 'shift' within Docs view.`,
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: "4rem" }}>
        <Tooltip
          {...args}
          content="This is string content. This is string content. This is string content."
        >
          <IconButton
            theme="dark"
            icon={CoreAssets.Icons.Exclamation}
            label="Details"
            onClick={() => {}}
          />
        </Tooltip>
      </div>
    );
  },
};
