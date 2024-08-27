import {
  RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import { useSliderNavigation } from '@common-hooks';
import { SliderDirection } from '@common-types';

type TabsVariant = 'page' | 'panel';

export interface Props {
  activeTabIndex?: number;
  loading?: boolean;
  variant: TabsVariant;
  onChange?: (index: number) => void;
}

export interface UseTabsResult {
  actions: {
    handleChange: (index: number) => void;
    scrollTo: (direction: SliderDirection) => void;
    setSelectedTabIndex: (index: number) => void;
    setTabs: (tabs: RefObject<HTMLButtonElement | HTMLAnchorElement>[]) => void;
  };
  state: {
    hasOverflow: SliderDirection[];
    selectedTabIndex: number;
    tabs: RefObject<HTMLButtonElement | HTMLAnchorElement>[];
    tabsCount: number;
    tabsId: string;
    tabsListRef: RefObject<HTMLDivElement>;
    tabsTitleId: string;
    variant: TabsVariant;
  };
}

export function useTabs({
  activeTabIndex = 0,
  loading,
  onChange,
  variant,
}: Props): UseTabsResult {
  const [_, startTransition] = useTransition();
  const [selectedTabIndex, setSelectedTabIndex] = useState(activeTabIndex);

  const tabsId = useId();
  const tabsTitleId = useId();

  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsCount = useMemo(() => 0, []);

  const [tabs, setTabs] = useState<RefObject<HTMLButtonElement | HTMLAnchorElement>[]>(
    [],
  );

  const handleTabClick = (nextTabIndex: number) => {
    startTransition(() => {
      setSelectedTabIndex(nextTabIndex);
    });
  };

  const { hasOverflow, scrollTo } = useSliderNavigation({
    container: tabsListRef,
    options: {
      condition: !!tabs.length && !loading,
    },
  });

  useEffect(() => {
    setSelectedTabIndex(activeTabIndex);
  }, [activeTabIndex]);

  return {
    actions: {
      handleChange: onChange ?? handleTabClick,
      scrollTo,
      setTabs,
      setSelectedTabIndex,
    },
    state: {
      hasOverflow,
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
