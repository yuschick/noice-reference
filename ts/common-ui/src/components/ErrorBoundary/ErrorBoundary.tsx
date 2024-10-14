import { IClient } from '@noice-com/platform-client';
import { Component, ComponentType, PropsWithChildren, ErrorInfo } from 'react';

export interface ErrorFallbackProps {
  error: Error;
  client?: IClient;
  resetErrorBoundary(): void | Promise<void>;
}

export interface Props extends PropsWithChildren {
  fallback: ComponentType<ErrorFallbackProps>;
  client?: IClient;
  onError?(error: Error, errorInfo: ErrorInfo): void;
  onReset?(): void;
}

interface State {
  error: Error | null;
  didCatch: boolean;
}

const initialState: State = {
  error: null,
  didCatch: false,
};

/**
 * ErrorBoundary is a component that can be used to wrap other components
 * and provide a fallback component to render if an error occurs within
 * the wrapped component.
 *
 * @note This component does NOT catch errors that occur in event handlers yet.
 *
 * @todo Potential future improvements:
 *  - Wrap the children in a context provider so that the children can
 *    trigger error boundaries if needed?
 *  - Figure out how to handle callback/timeout/raf errors without needing
 *    to add an element to the DOM for this boundary.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { ...initialState };
  }

  // @note: This is a built-in method from React, so we need to disable the
  // naming convention rule here as we cannot change the name of the method.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static getDerivedStateFromError(error: Error): State {
    return { error, didCatch: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  public resetBoundary = () => {
    const { error } = this.state;

    if (error === null) {
      return;
    }

    this.props.onReset?.();
    this.setState({ ...initialState });
  };

  public render() {
    const { fallback: Fallback, children, client } = this.props;
    const { error, didCatch } = this.state;

    if (error && didCatch) {
      return (
        <Fallback
          client={client}
          error={error}
          resetErrorBoundary={this.resetBoundary}
        />
      );
    }

    return children;
  }
}
