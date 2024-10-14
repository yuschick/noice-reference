import { StoryFn } from '@storybook/react';

import { Accordion, Props } from './Accordion';

import { AccordionProvider } from '@common/layout/Accordion/AccordionProvider';

export default {
  title: 'Layout/Accordion',
  component: Accordion,
};

const Template: StoryFn<Props> = () => {
  return (
    <AccordionProvider>
      <Accordion>
        <Accordion.Section
          id="1"
          title="element"
        >
          Meow!
        </Accordion.Section>
        <Accordion.Section
          description="Description"
          id="2"
          title="element with description"
        >
          Bark! Did you like my description?
        </Accordion.Section>
        <Accordion.Section
          id="3"
          title="I'm disabled and collapsed :("
          isDisabled
        >
          And you cannot even see my content :((((
        </Accordion.Section>
      </Accordion>
    </AccordionProvider>
  );
};

export const Default = {
  render: Template,
};
