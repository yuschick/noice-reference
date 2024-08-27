import { Meta, StoryObj } from '@storybook/react';

import { NoiceLogo } from '../NoiceLogo';

import { VisuallyHidden } from './VisuallyHidden';
import styles from './VisuallyHidden.stories.module.css';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Visually Hidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: `Visually Hidden is used when an element needs to be available to assistive technologies like screen readers, but be otherwise hidden. Use this component to provide context to information that may only be visually communicated.`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `It may be implied to some that a linked logo will return to the home page, but we can use <code>VisuallyHidden</code> to provide that context to the link.`,
      },
    },
  },
  render: () => {
    return (
      <a href="/">
        <NoiceLogo
          theme="light"
          variant="horizontal"
        />
        <VisuallyHidden>Go to home</VisuallyHidden>
      </a>
    );
  },
};
export const ShowOnFocus: Story = {
  parameters: {
    docs: {
      description: {
        story: `When the visually hidden content should be shown when focused, use the \`classNameOnFocus\` prop to provide visible styles. This is useful for skip links.`,
      },
    },
  },
  render: () => {
    return (
      <div>
        <p style={{ color: 'black' }}>
          Use the <kbd>Tab</kbd> key to focus the following link.
        </p>

        <VisuallyHidden classNameOnFocus={styles.showOnFocus}>
          <a href="/">Skip to main content</a>
        </VisuallyHidden>
      </div>
    );
  },
};
