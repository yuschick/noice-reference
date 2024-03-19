import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Props, useConfirmDialog } from './useConfirmDialog.hook';

import { ConfirmDialog } from '.';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Confirm Dialog',
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: `The ConfirmDialog component is a simple dialog for confirming or canceling an action. This component uses the native HTML <code>dialog</code> element. This means that basic accessibility considerations are already accounted for. This also means that there is no need for <code>z-index</code> values or <code>Portal</code> elements, as the <code>dialog</code> element is rendered at the <strong>#top-layer</strong> of the DOM.

To use, first call the <code>useConfirmDialog()</code> hook and pass in the required props. This hook returns the ConfirmDialog store, all of its actions and state required to run the component. Then pass this store into the root <code>ConfirmDialog</code> component.

    const store = useConfirmDialog({ 
      description?: string;
      onCancel?: (() => void) | [() => void, { label: string }];
      onClose?: () => void;
      onConfirm: (() => Promise<void>) | [() => Promise<void>, { label: string }];
      onOpen?: () => void;
      title: string;
     });

    return (
      <ConfirmDialog store={store} />
    )
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

function CreateConfirmDialog(props: Props) {
  const confirmDialog = useConfirmDialog(props);

  return (
    <>
      <Button
        variant="cta"
        onClick={confirmDialog.actions.open}
      >
        <span>Open Confirm Dialog</span>
      </Button>
      <ConfirmDialog store={confirmDialog} />
    </>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `A basic confirm dialog with a title, description, and two actions.
        
    const store = useConfirmDialog({
      description: 'Optional dialog description.',
      onCancel: () => {},
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
      title: 'Are you sure you want to leave the game?',
    });`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      description: 'Optional dialog description.',
      onCancel: () => {},
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
      title: 'Are you sure you want to leave the game?',
    }),
};

export const WithConfirmActionOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: `A confirm dialog only requires that an <code>onConfirm</code> action is provided.
        
      const store = useConfirmDialog({
      description: 'In honor of your first win, you have unlocked a new avatar cosmetic.',
      onConfirm: [
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
        { label: 'Claim' },
      ],
      title: 'You've unlocked a reward!',
    })`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      description: 'In honor of your first win, you have unlocked a new avatar cosmetic.',
      onConfirm: [
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
        { label: 'Claim' },
      ],
      title: "You've unlocked a reward!",
    }),
};

export const WithATitleOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: `The <code>description</code> of the <code>ConfirmDialog</code> is optional.
        
        const store = useConfirmDialog({
      onConfirm: [
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
        { label: 'Claim' },
      ],
      title: "You've unlocked a reward!",
    })`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      onConfirm: [
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
        { label: 'Claim' },
      ],
      title: "You've unlocked a reward!",
    }),
};

export const WithCustomActionLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: `Each action label can be customized by providing an optional options object to the <code>useConfirmDialog</code> hook.
          
          const store = useConfirmDialog({
      description: 'Changes to your profile will appear immediately.',
      onCancel: [() => {}, { label: 'Cancel' }],
      onConfirm: [
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
        { label: 'Save' },
      ],
      title: "Save changes?",
    })`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      description: 'Changes to your profile will appear immediately.',
      onCancel: [() => {}, { label: 'Cancel' }],
      onConfirm: [
        () => new Promise((resolve) => setTimeout(resolve, 2000)),
        { label: 'Save' },
      ],
      title: `Save changes?`,
    }),
};

export const WithLongContent: Story = {
  parameters: {
    docs: {
      description: {
        story: `Testing the extremes of the <code>ConfirmDialog</code> component by providing a long title and description. The dialog should never have this much content, but this story is to demonstrate the 'graceful' fallback just in case something happens.
          
          const store = useConfirmDialog({
      description: Array.from({ length: 100 }).fill("I'm a long description!").join(' '),
      onCancel: () => {},
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
      title: 'Holy Moly Content!',
    })`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      description: Array.from({ length: 100 }).fill("I'm a long description!").join(' '),
      onCancel: () => {},
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
      title: 'Holy Moly Content!',
    }),
};

export const WithCustomCallbacks: Story = {
  parameters: {
    docs: {
      description: {
        story: `The <code>useConfirmDialog</code> hook accepts custom <code>onOpen</code> and <code>onClose</code> callbacks to be triggered whenever the dialog is opened or closed.
          
          const store = useConfirmDialog({
      onCancel: () => {},
      onClose: () => console.log('Closed'),
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
      onOpen: () => console.log('Opened'),
      title: 'Did you check the console?',
    })`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      onCancel: () => {},
      /* eslint-disable no-console */
      onClose: () => console.log('Closed'),
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 2000)),
      onOpen: () => console.log('Opened'),
      /* eslint-enable no-console */
      title: 'Did you check the console?',
    }),
};
