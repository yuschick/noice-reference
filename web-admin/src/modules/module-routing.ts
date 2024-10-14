import { modules } from './modules';

import { ModuleBreadcrumb, ModuleWithPaths } from '@common/module';
import { AuthPlatformRole } from '@gen';

export const moduleWithPaths = modules.map<ModuleWithPaths>((module) => ({
  ...module,
  path: module.id,
  pages: module.pages.map((page) => ({
    ...page,
    // Made the path from the ids of module and page
    path: [module.id, page.id].filter((id) => id !== 'index').join('/'),
    subPages: page.subPages?.map((subPage) => ({
      ...subPage,
      // Made the path from the ids of module, parent page and page
      path: [module.id, page.id, subPage.id].filter((id) => id !== 'index').join('/'),
      subSubPages: subPage.subSubPages?.map((subSubPage) => ({
        ...subSubPage,
        path: [module.id, page.id, subPage.id, subSubPage.id]
          .filter((id) => id !== 'index')
          .join('/'),
      })),
    })),
  })),
}));

export const modulePathPermissions = moduleWithPaths.reduce<
  Record<string, AuthPlatformRole[]>
>((acc, module) => {
  acc[module.path.replace('/*', '')] =
    module.pages.find((page) => page.id === 'index')?.permissions ?? [];

  module.pages.forEach((page) => {
    // Set the page permissions
    acc[page.path.replace('/*', '')] = page.permissions ?? [];

    if (!page.subPages) {
      return;
    }

    page.subPages.forEach((subPage) => {
      acc[subPage.path.replace('/*', '')] = subPage.permissions ?? [];

      if (!subPage.subSubPages) {
        return;
      }

      subPage.subSubPages.forEach((subSubPage) => {
        acc[subSubPage.path.replace('/*', '')] = subSubPage.permissions ?? [];
      });
    });
  });

  return acc;
}, {});

// Flat all module pages to one array
export const routes = moduleWithPaths
  .map((module) =>
    module.pages
      .map((page) => [
        page,
        ...(page.subPages ?? []),
        ...(page.subPages?.map((subPage) => subPage.subSubPages ?? []).flat() ?? []),
      ])
      .flat(),
  )
  .flat();

export const topNavigationItems = moduleWithPaths
  // Remove modules that should be excluded from navigation
  .filter((module) => !module.isExcludedFromNavigation)
  // Remove index pages from sub pages, as it is the same as module link
  .map<ModuleWithPaths>((module) => ({
    ...module,
    pages: module.pages
      .filter((page) => page.id !== 'index' && !page.id.startsWith(':'))
      // Remove possible stars from end
      .map((page) => ({ ...page, path: page.path.replace('/*', '') })),
  }));

export const moduleBreadCrumbs = moduleWithPaths.map((module) => {
  const breadcrumbs: ModuleBreadcrumb[] = [];

  module.pages.forEach((page) => {
    if (!page.subPages) {
      breadcrumbs.push({ page });
      return;
    }

    page.subPages.forEach((subPage) => {
      if (!subPage.subSubPages) {
        breadcrumbs.push({ page, subPage });
        return;
      }

      subPage.subSubPages.forEach((subSubPage) => {
        breadcrumbs.push({
          page,
          subPage,
          subSubPage,
        });
        return;
      });
    });
  });

  return {
    ...module,
    breadcrumbs,
  };
});
