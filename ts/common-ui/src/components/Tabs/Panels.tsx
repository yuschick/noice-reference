import { Children, isValidElement } from 'react';

import { Panel } from './Panel';
import { PanelProvider } from './TabsProvider';

import { WithChildren } from '@common-types';

export function Panels({ children }: WithChildren) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type !== Panel) {
      throw new Error(`Tabs.Panels: Invalid child type: ${child.type}`);
    }
  });

  return (
    <div>
      {Children.map(children, (child, index) => {
        return (
          <PanelProvider
            index={index}
            key={index}
          >
            {child}
          </PanelProvider>
        );
      })}
    </div>
  );
}
