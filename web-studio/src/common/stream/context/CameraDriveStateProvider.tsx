import { WithChildren } from '@noice-com/common-ui';
import { createContext, useContext, useState } from 'react';

interface Context {
  enabled: boolean;
  active: boolean;
  setActive: (active: boolean) => void;
  setEnabled: (enabled: boolean) => void;
}

const CameraDriveStatusContext = createContext<Context>({
  active: false,
  enabled: false,
  setActive: () => {},
  setEnabled: () => {},
});

export function CameraDriveStateProvider({ children }: WithChildren) {
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  return (
    <CameraDriveStatusContext.Provider value={{ active, setActive, enabled, setEnabled }}>
      {children}
    </CameraDriveStatusContext.Provider>
  );
}

export function useCameraDriveState() {
  return useContext(CameraDriveStatusContext);
}
