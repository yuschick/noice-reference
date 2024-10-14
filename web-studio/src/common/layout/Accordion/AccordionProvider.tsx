import { WithChildren } from '@noice-com/common-ui';
import { createContext, useCallback, useContext, useState } from 'react';

interface Context {
  toggleSection: (id: string) => void;
  expandSection: (id: string) => void;
  collapseSection: (id: string) => void;
  expandedSectionIds: Set<string>;
}

const AccordionContext = createContext<Context | null>(null);

export function AccordionProvider({ children }: WithChildren) {
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
  const expandSection = useCallback((id: string) => {
    setExpandedSectionIds((ids) => {
      const updated = new Set(ids);
      updated.add(id);
      return updated;
    });
  }, []);

  const collapseSection = useCallback((id: string) => {
    setExpandedSectionIds((ids) => {
      const updated = new Set(ids);
      updated.delete(id);
      return updated;
    });
  }, []);

  const toggleSection = useCallback(
    (id: string) => {
      if (expandedSectionIds.has(id)) {
        collapseSection(id);
        return;
      }

      expandSection(id);
    },
    [collapseSection, expandSection, expandedSectionIds],
  );

  return (
    <AccordionContext.Provider
      value={{
        toggleSection,
        expandSection,
        collapseSection,
        expandedSectionIds,
      }}
    >
      {children}
    </AccordionContext.Provider>
  );
}

export function useAccordionContext(): Context {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Trying to access context without AccordionContext');
  }

  return context;
}
