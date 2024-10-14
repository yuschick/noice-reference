import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { Icon } from '@noice-com/common-ui';
import React, { ComponentProps } from 'react';

import styles from './GettingStarted.module.css';
import { StreamingOnNoiceSection } from './sections';
import { GetReadyToStreamSection } from './sections/GetReadyToStream';
import { NoicePredictionsSection } from './sections/NoicePredictions';

import {
  Accordion,
  PageHeading,
  AccordionProvider,
  useAccordionContext,
} from '@common/layout';
import { OnboardingSteps, useOnboardingContext } from '@common/onboarding';

interface Step {
  id: string;
  title: string;
  content: React.JSX.Element;
}

interface AccordionStepConfig extends ComponentProps<typeof Accordion.Section>, Step {}

const CheckIcon = (
  <Icon
    className={styles.iconComplete}
    icon={CoreAssets.Icons.CheckCircle}
  />
);

function GettingStarted() {
  const section = 'onboarding';
  const { expandSection, collapseSection } = useAccordionContext();
  const { onOnboardingStepCompleted, lastCompletedStep, shouldCompleteOnboarding } =
    useOnboardingContext();
  const onCompleted = (step: number) => {
    return onOnboardingStepCompleted(step);
  };

  useMountEffect(() => {
    if (!shouldCompleteOnboarding) {
      return;
    }

    expandSection(OnboardingSteps[lastCompletedStep + 1]);
  });

  const steps: Step[] = [
    {
      id: OnboardingSteps[0],
      title: 'Streaming on Noice',
      content: (
        <StreamingOnNoiceSection
          section={section}
          onCompleted={() => {
            onCompleted(0);
            collapseSection(OnboardingSteps[0]);
            expandSection(OnboardingSteps[1]);
          }}
        />
      ),
    },
    {
      id: OnboardingSteps[1],
      title: 'Noice predictions',
      content: (
        <NoicePredictionsSection
          section={section}
          onCompleted={() => {
            onCompleted(1);
            collapseSection(OnboardingSteps[1]);
            expandSection(OnboardingSteps[2]);
          }}
        />
      ),
    },
    {
      id: OnboardingSteps[2],
      title: 'Get ready to stream',
      content: (
        <GetReadyToStreamSection
          section={section}
          onCompleted={() => {
            onCompleted(2);
          }}
        />
      ),
    },
  ];

  const accordionSections: AccordionStepConfig[] = steps.map(
    ({ id, content, title }, index): AccordionStepConfig => {
      const previousStep = index - 1;
      const hasCompletedPreviousStep = lastCompletedStep > previousStep;
      const isCurrentStepActive = lastCompletedStep === previousStep;

      return {
        id,
        title,
        isDisabled:
          shouldCompleteOnboarding && !hasCompletedPreviousStep && !isCurrentStepActive,
        HeaderIcon:
          hasCompletedPreviousStep || !shouldCompleteOnboarding ? CheckIcon : undefined,
        content,
      };
    },
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <PageHeading
          description="We are the next-gen streaming platform for gamers that turns viewers into players with an interactive card game. This is enabled by our state-of-the-art streaming infrastructure which brings a few key differences to your streaming setup. To get started you'll need to follow the steps below."
          title="Welcome to stream on Noice!"
        />
        <Accordion>
          {accordionSections.map(({ id, content, ...props }) => (
            <Accordion.Section
              id={id}
              key={id}
              {...props}
            >
              {content}
            </Accordion.Section>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export function GettingStartedWrapper() {
  return (
    <AccordionProvider>
      <GettingStarted />
    </AccordionProvider>
  );
}
