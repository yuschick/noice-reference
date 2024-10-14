import classNames from 'classnames';
import { useMemo } from 'react';

import { PlatformNavigationLinkModel } from '../types';

import { useHighlightedNavigationLinks } from './hooks/useHighlightedNavigationLinks.hook';
import { useNavigationLinkOptions } from './hooks/useNavigationLinkOptions.hook';
import styles from './PlatformNavigationItem.module.css';

import { NavigationItemCollapsed } from '@page/PageLayout/NavigationItem';
import { NavigationItemExpanded } from '@page/PageLayout/NavigationItem/NavigationItemExpanded';

interface Props {
  navigationLink: PlatformNavigationLinkModel;
  mode: 'collapsed' | 'expanded';
}

export function PlatformNavigationItem({ navigationLink, mode }: Props) {
  const navigationLinkOptions = useNavigationLinkOptions();
  const highlightedLinks = useHighlightedNavigationLinks();

  const { highlightReason, to } = navigationLink;

  const options = navigationLinkOptions.find((option) => option.to === to);

  const customTooltip = useMemo(() => {
    if (!options?.customTooltip) {
      return;
    }

    return <options.customTooltip />;
  }, [options]);

  return (
    <li className={classNames(styles.listItem, styles[mode])}>
      {mode === 'collapsed' && (
        <NavigationItemCollapsed
          highlight={highlightedLinks.includes(to) ? highlightReason : undefined}
          navigationItem={navigationLink}
          {...(customTooltip
            ? { tooltip: { className: styles.customTooltip, component: customTooltip } }
            : {})}
        />
      )}

      {mode === 'expanded' && (
        <NavigationItemExpanded
          highlight={highlightedLinks.includes(to) ? highlightReason : undefined}
          navigationItem={navigationLink}
          {...(customTooltip
            ? { tooltip: { className: styles.customTooltip, component: customTooltip } }
            : {})}
        />
      )}
    </li>
  );
}
