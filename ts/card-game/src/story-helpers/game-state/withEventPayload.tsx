import { IMatchGroupDelegate } from '@noice-com/platform-client';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { StoryContext } from '@storybook/react';
import { ReactElement, useEffect } from 'react';

// @todo Figure out how to type this properly and not use any
export const withEventPayload =
  (mockMatchGroup: MockMatchGroup, eventData: any) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext) => {
    // Let's set the given mock data to the mockMatchGroup
    useEffect(() => {
      if (!eventData) {
        return;
      }

      Object.entries(eventData).forEach(([eventName, payload]) => {
        const key = eventName as keyof IMatchGroupDelegate;
        mockMatchGroup.setMock(key, payload ?? {});
      });
    }, []);

    return <Story {...context.args} />;
  };
