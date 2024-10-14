import { SvgComponent } from '@noice-com/common-ui';

import { ContextualSidebarWrapper } from '@common/sidebar';
import { AuthPlatformRole } from '@gen';

export interface Page {
  id: string;
  title: string;
  component: JSX.Element;
  icon: SvgComponent;
  description?: string;
  /**
   * All pages are allowed to admin.  Leaving this out means it is allowed only for admin,
   * and giving roles means it is allowed only for those roles AND admin.
   */
  permissions?: (
    | AuthPlatformRole.PlatformRoleModerator
    | AuthPlatformRole.PlatformRolePxAgent
  )[];
}

export interface Module<T extends Page = Page> {
  id: string;
  title: string;
  pages: (T & {
    subPages?: (T & {
      subSubPages?: T[];
      isSubSubPagesExcludedFromNavigation?: boolean;
    })[];
    contextualSidebarWrapper?: ContextualSidebarWrapper;
  })[];
  isExcludedFromNavigation?: boolean;
}

export interface ContextualPageWithPath extends Page {
  path: string;
  contextualSidebarWrapper?: ContextualSidebarWrapper;
}

export interface PageWithPath extends Page {
  path: string;
}

export interface ModuleWithPaths extends Module<PageWithPath> {
  path: string;
}

export interface PageParam {
  param: string;
  value: string;
}

export interface ModuleBreadcrumb {
  page: PageWithPath;
  subPage?: PageWithPath;
  subSubPage?: PageWithPath;
}
