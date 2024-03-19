import { Meta, StoryObj } from "@storybook/react";
import { BiChevronLeft, BiChevronDown } from "react-icons/bi";

import { Button } from "./Button";
import {
  buttonColors,
  buttonLevels,
  buttonShapes,
  buttonSizes,
  buttonVariants,
} from "./Button.types";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      defaultValue: "light",
      description: "Define the theme palette of the button.",
      options: buttonColors,
    },
    fit: {
      control: { type: "select" },
      defaultValue: "container",
      description:
        "Define the fit of the button. If `container` (default), the button will stretch to fill its container. If `content` the button will shrink to the size of its content only.",
      options: ["container", "content"],
    },
    iconEnd: {
      control: { type: "text" },
      description:
        "Provide an `SvgComponent` to be rendered at the inline end of the button.",
    },
    iconStart: {
      control: { type: "text" },
      description:
        "Provide an `SvgComponent` to be rendered at the inline start of the button.",
    },
    isDisabled: {
      control: { type: "boolean" },
      defaultValue: false,
      description:
        "Define if the button is disabled. This props maps to `aria-disabled` instead of `disabled` and avoids using `pointer-events: none` to allow for better accessibility.",
    },
    isLoading: {
      control: { type: "boolean" },
      defaultValue: false,
      description:
        "Define if the button is in a loading state. This will also disable the button from additional triggers.",
    },
    level: {
      control: { type: "select" },
      defaultValue: "primary",
      description: "Define the hierarchy level of the button.",
      options: buttonLevels,
    },
    ref: {
      description: "Define a HTMLButtonElement ref to be passed to the button.",
    },
    shape: {
      control: { type: "select" },
      defaultValue: "pill",
      description: "Define the shape of the button.",
      options: buttonShapes,
    },
    size: {
      control: { type: "select" },
      defaultValue: "md",
      description:
        "Define the size of the button. This value defines the button block size, while the inline size is built to fill its container.",
      options: buttonSizes,
    },
    variant: {
      control: { type: "select" },
      defaultValue: "solid",
      description: "Define the button variant, or style, type.",
      options: buttonVariants,
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        component: `The base button component with multiple variant, level and color combinations. The button supports icons at either or both sides, and incorporates accessibility benefits while disabled and loading.
        
The inline size of the Button will stretch to fill its container while its minimum inline size should never go below its max-content value. In order to size the button, its container must be styled, not the Button itself.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    theme: "light",
    variant: "solid",
    level: "primary",
  },
  render: (args) => (
    <div style={{ inlineSize: "500px" }}>
      <Button {...args}>Button</Button>
    </div>
  ),
};

export const CTAButtons: Story = {
  args: {
    variant: "cta",
  },
  parameters: {
    docs: {
      description: {
        story: `The CTA variant is used for the primary action on a page. It should be used sparingly, and only once per page. It currently only supports one primary level.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" />
        <Button {...args} size="sm" />
        <Button {...args} />
        <Button {...args} size="lg" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isDisabled />
        <Button {...args} size="sm" isDisabled />
        <Button {...args} isDisabled />
        <Button {...args} size="lg" isDisabled />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isLoading />
        <Button {...args} size="sm" isLoading />
        <Button {...args} isLoading />
        <Button {...args} size="lg" isLoading />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} iconStart={BiChevronLeft} size="xs" />
        <Button {...args} iconStart={BiChevronLeft} size="sm" />
        <Button {...args} iconEnd={BiChevronDown} iconStart={BiChevronLeft} />
        <Button {...args} iconEnd={BiChevronDown} size="lg" />
      </div>
    </div>
  ),
};

export const SolidLightPrimaryButtons: Story = {
  args: {
    theme: "light",
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" />
        <Button {...args} size="sm" />
        <Button {...args} />
        <Button {...args} size="lg" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isDisabled />
        <Button {...args} size="sm" isDisabled />
        <Button {...args} isDisabled />
        <Button {...args} size="lg" isDisabled />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isLoading />
        <Button {...args} size="sm" isLoading />
        <Button {...args} isLoading />
        <Button {...args} size="lg" isLoading />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} iconStart={BiChevronLeft} size="xs" />
        <Button {...args} iconStart={BiChevronLeft} size="sm" />
        <Button {...args} iconEnd={BiChevronDown} iconStart={BiChevronLeft} />
        <Button {...args} iconEnd={BiChevronDown} size="lg" />
      </div>
    </div>
  ),
};

export const SolidLightSecondaryButtons: Story = {
  args: {
    theme: "light",
    level: "secondary",
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" />
        <Button {...args} size="sm" />
        <Button {...args} />
        <Button {...args} size="lg" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isDisabled />
        <Button {...args} size="sm" isDisabled />
        <Button {...args} isDisabled />
        <Button {...args} size="lg" isDisabled />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isLoading />
        <Button {...args} size="sm" isLoading />
        <Button {...args} isLoading />
        <Button {...args} size="lg" isLoading />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} iconStart={BiChevronLeft} size="xs" />
        <Button {...args} iconStart={BiChevronLeft} size="sm" />
        <Button {...args} iconEnd={BiChevronDown} iconStart={BiChevronLeft} />
        <Button {...args} iconEnd={BiChevronDown} size="lg" />
      </div>
    </div>
  ),
};

export const SolidDarkPrimaryButtons: Story = {
  args: {
    theme: "dark",
    variant: "solid",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" />
        <Button {...args} size="sm" />
        <Button {...args} />
        <Button {...args} size="lg" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isDisabled />
        <Button {...args} size="sm" isDisabled />
        <Button {...args} isDisabled />
        <Button {...args} size="lg" isDisabled />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isLoading />
        <Button {...args} size="sm" isLoading />
        <Button {...args} isLoading />
        <Button {...args} size="lg" isLoading />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} iconStart={BiChevronLeft} size="xs" />
        <Button {...args} iconStart={BiChevronLeft} size="sm" />
        <Button {...args} iconEnd={BiChevronDown} iconStart={BiChevronLeft} />
        <Button {...args} iconEnd={BiChevronDown} size="lg" />
      </div>
    </div>
  ),
};

export const SolidDarkSecondaryButtons: Story = {
  args: {
    theme: "dark",
    level: "secondary",
    variant: "solid",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: `Solid buttons will be used most often, with multiple colors and levels. They can be used in any context, and should be used for secondary and lesser actions on a page.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" />
        <Button {...args} size="sm" />
        <Button {...args} />
        <Button {...args} size="lg" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isDisabled />
        <Button {...args} size="sm" isDisabled />
        <Button {...args} isDisabled />
        <Button {...args} size="lg" isDisabled />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isLoading />
        <Button {...args} size="sm" isLoading />
        <Button {...args} isLoading />
        <Button {...args} size="lg" isLoading />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} iconStart={BiChevronLeft} size="xs" />
        <Button {...args} iconStart={BiChevronLeft} size="sm" />
        <Button {...args} iconEnd={BiChevronDown} iconStart={BiChevronLeft} />
        <Button {...args} iconEnd={BiChevronDown} size="lg" />
      </div>
    </div>
  ),
};

export const GhostButtons: Story = {
  args: {
    variant: "ghost",
  },
  parameters: {
    docs: {
      description: {
        story: `Ghost buttons will be used more sparingly. They can be used for auxillary-like actions. This variant mostly serves as a base to the IconButton.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" />
        <Button {...args} size="sm" />
        <Button {...args} />
        <Button {...args} size="lg" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} theme="dark" size="xs" variant="ghost" />
        <Button {...args} theme="dark" size="sm" variant="ghost" />
        <Button {...args} theme="dark" variant="ghost" />
        <Button {...args} theme="dark" size="lg" variant="ghost" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isDisabled />
        <Button {...args} size="sm" isDisabled />
        <Button {...args} isDisabled />
        <Button {...args} size="lg" isDisabled />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} size="xs" isLoading />
        <Button {...args} size="sm" isLoading />
        <Button {...args} isLoading />
        <Button {...args} size="lg" isLoading />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button {...args} iconStart={BiChevronLeft} size="xs" />
        <Button {...args} iconStart={BiChevronLeft} size="sm" />
        <Button {...args} iconEnd={BiChevronDown} iconStart={BiChevronLeft} />
        <Button {...args} iconEnd={BiChevronDown} size="lg" />
      </div>
    </div>
  ),
};

export const ButtonShapes: Story = {
  args: {
    variant: "solid",
  },
  parameters: {
    docs: {
      description: {
        story: `A button can have its shape adjusted to affect its border radius and sizing. This is really only here to support 'circle' for the IconButton, but may be extended later.
        
> Note: Shape 'circle' should not be used outside of the IconButton.`,
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      }}
    >
      <Button {...args} shape="sharp" />
      <Button {...args} shape="rounded" />
      <Button {...args} />
    </div>
  ),
};

export const Fit: Story = {
  args: {
    theme: "light",
    variant: "solid",
    level: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A button can be sized to either its container or its content by providing a `fit` prop. The default is `container`.",
      },
    },
  },
  render: (args) => (
    <div style={{ inlineSize: "500px", display: "grid", gap: "1rem" }}>
      <Button fit="container" {...args}>
        Container
      </Button>
      <Button fit="content" {...args}>
        Content
      </Button>
    </div>
  ),
};
