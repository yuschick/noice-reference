import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi';

import { VisuallyHidden } from '../VisuallyHidden';

import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Segmented Control',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'array' },
      description:
        'Provide a list of SegmentedControl.Button components, a minimum of 2 is required and a maximum of 5 can be defined.',
    },
    displayValue: {
      control: { type: 'string' },
      defaultValue: '',
      description: 'Provide a value to be visibly shown next to the label.',
    },
    label: {
      control: { type: 'text' },
      description:
        'Provide both the visual and accessible label to be associated with the list of controls.',
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `The Segmented Control component is used to group a list of buttons that allow the user to select a single option from a list of options.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

type Props = {
  withIcon?: boolean;
  withValue?: boolean;
};

function DefaultControl({ withIcon, withValue }: Props) {
  const [value, setValue] = useState('relative');

  return (
    <SegmentedControl
      displayValue={withValue ? value : undefined}
      label="Timestamp"
    >
      <SegmentedControl.Button
        iconStart={withIcon ? BiArrowToTop : undefined}
        isSelected={value === 'relative'}
        onClick={() => setValue('relative')}
      >
        Relative
      </SegmentedControl.Button>
      <SegmentedControl.Button
        iconStart={withIcon ? BiArrowToBottom : undefined}
        isSelected={value === 'absolute'}
        onClick={() => setValue('absolute')}
      >
        Absolute
      </SegmentedControl.Button>
    </SegmentedControl>
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: '500px' }}>
      <DefaultControl />
    </div>
  ),
};

export const Value: Story = {
  render: () => (
    <div style={{ inlineSize: '500px' }}>
      <DefaultControl withValue />
    </div>
  ),
};

export const ButtonIcons: Story = {
  render: () => (
    <div style={{ inlineSize: '500px' }}>
      <DefaultControl withIcon />
    </div>
  ),
};

function FontSizeSelector() {
  const [size, setSize] = useState('medium');

  return (
    <SegmentedControl
      displayValue={size}
      label="Font size"
    >
      <SegmentedControl.Button
        isSelected={size === 'small'}
        onClick={() => setSize('small')}
      >
        <span
          aria-hidden="true"
          style={{ fontSize: 'var(--noi-font-size-sm)' }}
        >
          Aa
        </span>
        <VisuallyHidden>Small</VisuallyHidden>
      </SegmentedControl.Button>
      <SegmentedControl.Button
        isSelected={size === 'medium'}
        onClick={() => setSize('medium')}
      >
        <span
          aria-hidden="true"
          style={{ fontSize: 'var(--noi-font-size-md)' }}
        >
          Aa
        </span>
        <VisuallyHidden>Medium</VisuallyHidden>
      </SegmentedControl.Button>
      <SegmentedControl.Button
        isSelected={size === 'large'}
        onClick={() => setSize('large')}
      >
        <span
          aria-hidden="true"
          style={{ fontSize: 'var(--noi-font-size-lg)' }}
        >
          Aa
        </span>
        <VisuallyHidden>Large</VisuallyHidden>
      </SegmentedControl.Button>
    </SegmentedControl>
  );
}

export const CustomContent: Story = {
  render: () => (
    <div style={{ inlineSize: '500px' }}>
      <FontSizeSelector />
    </div>
  ),
};
