/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

import { Sequencer } from './Sequencer';
import type { Props, SequencerProps } from './Sequencer';
import storyStyles from './SequencerStories.module.css';

interface TestComponentProps {
  label: string;
  onStepFinished(): void;
}

const CSSAnimatedComponent = ({ label, onStepFinished }: TestComponentProps) => (
  <div
    className={storyStyles.animated}
    onAnimationEnd={onStepFinished}
  >
    {label}
  </div>
);

const TimeoutComponent = ({ label, onStepFinished }: TestComponentProps) => {
  useEffect(() => {
    const timeout = setTimeout(onStepFinished, 1000);

    return () => clearTimeout(timeout);
  }, [onStepFinished]);

  return <div>{label}</div>;
};

export default {
  title: 'Sequencer',
  component: Sequencer,
};

export const CSSAnimationSequence = {
  args: {
    children: ({ onStepFinished }: SequencerProps) => [
      <CSSAnimatedComponent
        key="first"
        label="First"
        onStepFinished={onStepFinished}
      />,
      <CSSAnimatedComponent
        key="second"
        label="Second"
        onStepFinished={onStepFinished}
      />,
      <CSSAnimatedComponent
        key="third"
        label="Third"
        onStepFinished={onStepFinished}
      />,
    ],
  },
};

export const TimeoutSequence = {
  args: {
    children: ({ onStepFinished }: SequencerProps) => [
      <TimeoutComponent
        key="first"
        label="First"
        onStepFinished={onStepFinished}
      />,
      <TimeoutComponent
        key="second"
        label="Second"
        onStepFinished={onStepFinished}
      />,
      <TimeoutComponent
        key="third"
        label="Third"
        onStepFinished={onStepFinished}
      />,
    ],
  },
};

export const DynamicObjectsSequence = {
  render: (args: Props) => {
    const [showThird, setShowThird] = useState(true);

    useEffect(() => {
      // Disable third component after 1.5 seconds
      // (halfway through second component)
      const timeout = setTimeout(() => {
        setShowThird(false);
      }, 1500);

      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <Sequencer {...args}>
        {({ ...props }) => [
          <CSSAnimatedComponent
            key="first"
            label="First"
            {...props}
          />,
          <CSSAnimatedComponent
            key="second"
            label="Second"
            {...props}
          />,
          showThird && (
            <CSSAnimatedComponent
              key="third"
              label="Third"
              {...props}
            />
          ),
          <TimeoutComponent
            key="fourth"
            label="Fourth"
            {...props}
          />,
        ]}
      </Sequencer>
    );
  },
};
