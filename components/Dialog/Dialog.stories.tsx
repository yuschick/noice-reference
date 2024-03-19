import { Meta, StoryObj } from "@storybook/react";

import { Button } from "../Button";

import { Props, useDialog } from "./useDialog.hook";

import { Dialog } from ".";

const meta: Meta<typeof Dialog> = {
  title: "Dialog",
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: `The Dialog component is a simple dialog for confirming or canceling an action. This component uses the native HTML <code>dialog</code> element. This means that basic accessibility considerations are already accounted for. This also means that there is no need for <code>z-index</code> values or <code>Portal</code> elements, as the <code>dialog</code> element is rendered at the <strong>#top-layer</strong> of the DOM.
        
The Dialog component supports custom content and custom actions, along with each section being plug and play.
        
To use, first call the <code>useDialog()</code> hook and pass in the required props. This hook returns the Dialog store, all of its actions and state required to run the component. Then pass this store into the root <code>Dialog</code> component.
        
    const store = useDialog({
      title: string;
      onClose?: () => void;
      onOpen?: () => void;
    });

    return (
      <Dialog store={store}> ... </Dialog>;
    )`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

type Options = {
  close?: boolean;
  contentLength?: number;
};

function CreateConfirmDialog(props: Props, options?: Options) {
  const dialog = useDialog(props);

  const content = Array.from({ length: options?.contentLength ?? 1 }).map(
    (_, i) => (
      <p key={i}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis
        officia molestias illo quidem laudantium, assumenda omnis doloremque
        nobis fuga pariatur consequuntur voluptates corrupti eaque voluptas
        reprehenderit magnam eius, excepturi earum.
      </p>
    )
  );

  return (
    <>
      <Button size="sm" variant="cta" onClick={dialog.actions.open}>
        Open Dialog
      </Button>

      <Dialog store={dialog}>
        <Dialog.Header />
        <Dialog.Content>{content}</Dialog.Content>
        <Dialog.Actions>
          <Button
            theme="dark"
            level="secondary"
            size="sm"
            onClick={dialog.actions.close}
          >
            Cancel
          </Button>
          <Button theme="dark" size="sm" onClick={dialog.actions.close}>
            Okay
          </Button>
        </Dialog.Actions>
        {options?.close && <Dialog.Close />}
      </Dialog>
    </>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `A standard example of the Dialog component.
        
    const store = useDialog({ title: "Default Dialog" });

    return (
      <Dialog store={store}>
        <Dialog.Header />
        <Dialog.Content> ... </Dialog.Content>
        <Dialog.Actions> ... </Dialog.Actions>
        <Dialog.Close />
      </Dialog>
    )`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({ title: "Default Dialog" }, { close: true }),
};

export const WithLongContent: Story = {
  parameters: {
    docs: {
      description: {
        story: `If the content of the Dialog is too long for the screen, the content section will scroll as a graceful fallback.

                
    const store = useDialog({ title: "Long Content" });

    return (
      <Dialog store={store}>
        <Dialog.Header />
        <Dialog.Content> ... </Dialog.Content>
        <Dialog.Actions> ... </Dialog.Actions>
        <Dialog.Close />
      </Dialog>
    )`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog(
      { title: "Long Content" },
      { close: true, contentLength: 10 }
    ),
};

export const WithoutCloseButton: Story = {
  parameters: {
    docs: {
      description: {
        story: `The Dialog component is built to be plug and play with its sections. To not include a close button in the Dialog, simply do not render the Dialog.Close child component.
        
    const store = useDialog({ title: "Without Close Button" });

    return (
      <Dialog store={store}>
        <Dialog.Header />
        <Dialog.Content> ... </Dialog.Content>
        <Dialog.Actions> ... </Dialog.Actions>
      </Dialog>
    )`,
      },
    },
  },
  render: () => CreateConfirmDialog({ title: "Without Close Button" }),
};

export const WithCustomCallbacks: Story = {
  parameters: {
    docs: {
      description: {
        story: `The <code>useDialog</code> hook accepts custom <code>onOpen</code> and <code>onClose</code> callbacks to be triggered whenever the dialog is opened or closed.
        
    const store = useDialog({
      onClose: () => console.log('Closed'),
      onOpen: () => console.log('Opened'),
      title: 'Custom Callbacks',
    });

    return (
      <Dialog store={store}>
        <Dialog.Header />
        <Dialog.Content> ... </Dialog.Content>
        <Dialog.Actions> ... </Dialog.Actions>
      </Dialog>
    )`,
      },
    },
  },
  render: () =>
    CreateConfirmDialog({
      /* eslint-disable no-console */
      onClose: () => console.log("Closed"),
      onOpen: () => console.log("Opened"),
      /* eslint-enable no-console */
      title: "Custom Callbacks",
    }),
};
