import { action } from '@storybook/addon-actions';
import { StoryObj } from '@storybook/react';
import { PropsWithChildren, useEffect, useState } from 'react';

import { ErrorBoundary, ErrorFallbackProps, Props } from './ErrorBoundary';

export default {
  title: 'ErrorBoundary',
  component: ErrorBoundary,
};

// Utils
const Container = ({ children }: PropsWithChildren) => (
  <div style={{ width: '100%', maxWidth: '500px' }}>{children}</div>
);

interface ThrowerProps {
  throwFn: () => void | never;
}

const ExampleChild = ({ throwFn }: ThrowerProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 0) {
      return;
    }

    throwFn();
  }, [count, throwFn]);

  return (
    <div>
      Click the button to throw an error.
      <button onClick={() => setCount((c) => c + 1)}>Throw Error</button>
    </div>
  );
};

const Fallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div
    style={{
      backgroundColor: 'var(--noi-color-status-error-700)',
      border: '1px solid var(--noi-color-status-error-400)',
      padding: '0.5em',
    }}
  >
    There was an error: {error.message}
    <pre style={{ overflowX: 'scroll' }}>{error.stack}</pre>
    <button onClick={resetErrorBoundary}>Reset Boundary</button>
  </div>
);

export const ExplicitThrow: StoryObj<Props> = {
  render: ({ ...args }) => {
    return (
      <Container>
        <ErrorBoundary {...args}>
          <ExampleChild
            throwFn={() => {
              throw new Error('Explicitly thrown error');
            }}
          />
        </ErrorBoundary>
      </Container>
    );
  },

  args: {
    onError: action('onError'),
    onReset: action('onReset'),
    fallback: Fallback,
  },
};

export const ImplicitThrow: StoryObj<Props> = {
  render: ({ ...args }) => {
    const foo = {};

    return (
      <Container>
        <ErrorBoundary {...args}>
          <ExampleChild
            throwFn={() => {
              // @ts-expect-error We are intentionally throwing here.
              foo.bar();
            }}
          />
        </ErrorBoundary>
      </Container>
    );
  },

  args: {
    onError: action('onError'),
    onReset: action('onReset'),
    fallback: Fallback,
  },
};

export const NestedBoundaries: StoryObj<Props> = {
  render: ({ ...args }) => {
    return (
      <Container>
        <ErrorBoundary {...args}>
          <div style={{ marginBlockEnd: '1rem' }}>
            This is in the top-most error boundary and should not go away when the child
            throws.
          </div>

          <ErrorBoundary {...args}>
            <ExampleChild
              throwFn={() => {
                throw new Error('Nested Child Error');
              }}
            />
          </ErrorBoundary>
        </ErrorBoundary>
      </Container>
    );
  },

  args: {
    onError: action('onError'),
    onReset: action('onReset'),
    fallback: Fallback,
  },
};
