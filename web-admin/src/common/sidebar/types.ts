import { WithChildren } from '@noice-com/common-ui';

export enum SidebarType {
  Static = 'Static',
  Contextual = 'Contextual',
  None = 'None',
}

export type ContextualSidebarWrapperProps = WithChildren<{ className?: string }>;

export type ContextualSidebarWrapper = (
  props: ContextualSidebarWrapperProps,
) => JSX.Element;
