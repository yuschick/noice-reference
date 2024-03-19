import {
  RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation.hook';

type TabsVariant = 'page' | 'panel';

export interface Props {
  activeTabIndex?: number;
  variant: TabsVariant;
  onChange?: (index: number) => void;
}

export interface UseTabsResult {
  actions: {
    handleChange: (index: number) => void;
    setSelectedTabIndex: (index: number) => void;
  };
  state: {
    selectedTabIndex: number;
    tabs: RefObject<(HTMLButtonElement | HTMLAnchorElement)[]>;
    tabsCount: number;
    tabsId: string;
    tabsListRef: RefObject<HTMLDivElement>;
    tabsTitleId: string;
    variant: TabsVariant;
  };
}

export function useTabs({ activeTabIndex = 0, onChange, variant }: Props): UseTabsResult {
  const [_, startTransition] = useTransition();
  const [selectedTabIndex, setSelectedTabIndex] = useState(activeTabIndex);

  const tabsId = useId();
  const tabsTitleId = useId();

  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsCount = useMemo(() => 0, []);

  const tabs = useRef<(HTMLButtonElement | HTMLAnchorElement)[]>([]);

  const handleTabClick = (nextTabIndex: number) => {
    startTransition(() => {
      setSelectedTabIndex(nextTabIndex);
    });
  };

  const { actions } = useKeyboardNavigation({
    container: tabsListRef,
    items: tabs,
    options: {
      initialFocusIndex: selectedTabIndex,
    },
  });

  useEffect(() => {
    const tabsList = tabsListRef.current;

    if (!tabsList) {
      return;
    }

    tabsList.addEventListener('keydown', actions.handleKeyboardNavigation);

    return () => {
      tabsList.removeEventListener('keydown', actions.handleKeyboardNavigation);
    };
  }, [actions.handleKeyboardNavigation]);

  useEffect(() => {
    setSelectedTabIndex(activeTabIndex);
  }, [activeTabIndex]);

  return {
    actions: {
      handleChange: onChange ?? handleTabClick,
      setSelectedTabIndex,
    },
    state: {
      selectedTabIndex,
      tabs,
      tabsCount,
      tabsId,
      tabsListRef,
      tabsTitleId,
      variant,
    },
  };
}
