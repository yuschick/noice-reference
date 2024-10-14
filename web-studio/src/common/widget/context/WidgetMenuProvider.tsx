import { WithChildren } from '@noice-com/common-ui';
import { createContext, ReactNode, useContext, useState } from 'react';

import { WidgetMenuOption } from '../types';

export type WidgetMenuContextType = {
  controls: ReactNode;
  filters: ReactNode;
  settings: ReactNode;
  menuOptions: WidgetMenuOption[];
  setControls: (controls: ReactNode) => void;
  setFilters: (settings: ReactNode) => void;
  setSettings: (settings: ReactNode) => void;
  setMenuOptions: (options: WidgetMenuOption[]) => void;
};

const defaultContext: WidgetMenuContextType = {
  controls: null,
  filters: null,
  settings: null,
  menuOptions: [],
  setControls: () => {},
  setFilters: () => {},
  setSettings: () => {},
  setMenuOptions: () => {},
};

const WidgetMenuContext = createContext<WidgetMenuContextType>(defaultContext);

// Here we have an option to add selected menuOptions to controls (for external popout purposes)
export function WidgetMenuProvider({ children }: WithChildren) {
  const [controls, setControls] = useState<ReactNode>(null);
  const [filters, setFilters] = useState<ReactNode>(null);
  const [settings, setSettings] = useState<ReactNode>(null);
  const [menuOptions, setMenuOptions] = useState<WidgetMenuOption[]>([]);

  return (
    <WidgetMenuContext.Provider
      value={{
        controls,
        filters,
        settings,
        menuOptions,
        setControls,
        setFilters,
        setSettings,
        setMenuOptions,
      }}
    >
      {children}
    </WidgetMenuContext.Provider>
  );
}

export const useWidgetMenu = () => useContext(WidgetMenuContext);
