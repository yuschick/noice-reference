import { injectDelegateMiddleware } from '../utils';

interface TestDelegate {
  foo(str: string, num: number): void;
}

describe('injectDelegateMiddleware', () => {
  it('should call the original function', () => {
    const original: TestDelegate = {
      foo: jest.fn(),
    };

    const injected = injectDelegateMiddleware(original, jest.fn());
    injected.foo('test', 55);

    expect(original.foo).toHaveBeenCalledWith('test', 55);
  });

  it('should call the injected function with the event name and payload', () => {
    const original = {
      foo: jest.fn(),
    };
    const shouldBeCalled = jest.fn();

    const injected = injectDelegateMiddleware(original, shouldBeCalled);
    injected.foo('test', 55);

    expect(original.foo).toHaveBeenCalled();
    expect(shouldBeCalled).toHaveBeenCalledWith('foo', ['test', 55]);
  });
});
