import { Nullable } from '@noice-com/utils';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

export interface SequencerProps {
  onStepFinished(): void;
}

export interface Props {
  children: (props: SequencerProps) => (React.ReactElement | false)[];
  onStepComplete?: (stepIndex: number) => void;
  onSequenceComplete(): void;
}

/**
 * Component for rendering a sequence of components in order.
 *
 * Each component is passed an `onFinished` callback, which it can call
 * once it completes whatever it is doing, and then the Sequencer will
 * move on to the next component in the sequence. Once complete, it will
 * trigger the onSequenceComplete prop.
 *
 * Note! It's recommended to use `useCallback` for the `onSequenceComplete` callback
 * to avoid unnecessary re-renders.
 *
 * @example
 * ```
 * <Sequencer onSequenceComplete={onSequenceComplete}>
 *  {({ onStepFinished }) => [
 *    <Component1 onFinished={onStepFinished} />,
 *    maybeRender && <Component2 onFinished={onStepFinished} />,
 *    <Component3 onFinished={onStepFinished} />,
 *  ]}
 * </Sequencer>
 * ```
 */
export function Sequencer({ children, onStepComplete, onSequenceComplete }: Props) {
  const lastSkippedIndex = useRef<Nullable<number>>(null);
  const [index, setIndex] = useState(0);

  const onStepFinished = useCallback(() => {
    setIndex((prev) => prev + 1);
  }, []);

  // Get the list of components to render
  const components = children({ onStepFinished });
  const componentsLen = components.length;
  const component = components[index];

  useEffect(() => {
    if (index >= componentsLen) {
      return;
    }

    if (component) {
      return;
    }

    // this is protecting re-renders triggering function call multiple times
    if (lastSkippedIndex.current === index) {
      return;
    }

    lastSkippedIndex.current = index;
    // if no component is found, we are done with the step but
    // not necessarily though with whole sequence since it might be a intentionally skipped step
    onStepFinished();
  }, [component, index, componentsLen, onStepFinished]);

  // We need to update the situation for parent in a useEffect by reacting to index changes.
  // If we do the onStepComplete call in the onStepFinished callback, the parent will have state change
  // same time as this component, which causes errors in console.
  useEffect(() => {
    if (index === 0) {
      return;
    }

    onStepComplete?.(index);
  }, [index, onStepComplete]);

  useEffect(() => {
    if (index < componentsLen) {
      return;
    }

    onSequenceComplete();
  }, [index, componentsLen, onSequenceComplete]);

  // Render the current component (if false, it will be skipped)
  if (!component) {
    return null;
  }

  // When a key is not included, React can re-use the previous component
  // (if it's the same type), which can cause issues, so we add a key
  // here to force React to always re-render the component when iterating.
  // This also makes it nicer to use externally :)
  return <Fragment key={`${index}`}>{components[index]}</Fragment>;
}
