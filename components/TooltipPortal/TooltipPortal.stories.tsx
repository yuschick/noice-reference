import { StoryObj } from '@storybook/react';
import { useRef } from 'react';

import { TooltipPortal, Props } from './TooltipPortal';

import { disableArg } from '@common-story-helpers';

export default {
  title: 'TooltipPortal',
  component: TooltipPortal,
  argTypes: {
    anchor: disableArg(),
    placement: { options: ['left', 'top'], control: { type: 'radio' } },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default: StoryObj<Props> = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const anchor = useRef<HTMLDivElement>(null);

    return (
      <>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            ref={anchor}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--noi-color-violet-main)',
            }}
          />
          <TooltipPortal
            {...args}
            anchorRef={anchor}
          >
            The tooltip
          </TooltipPortal>
        </div>
      </>
    );
  },
};
