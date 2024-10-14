import { Module, ModuleWithPaths, PageParam, PageWithPath } from './types';

const pageWithParamValue = (path: string, params: PageParam[]) => {
  params.forEach(({ param, value }) => (path = path.replace(param, value)));

  return path;
};

export const moduleWithCurrentPaths = (
  module: ModuleWithPaths,
  params: PageParam[],
): Module<PageWithPath & { paramPath: string }> => ({
  ...module,
  pages: module.pages.map((page) => ({
    ...page,
    paramPath: pageWithParamValue(page.path, params),
    subPages: page.subPages?.map((subPage) => ({
      ...subPage,
      paramPath: pageWithParamValue(subPage.path, params),
      subSubPages: subPage.subSubPages?.map((subSubPage) => ({
        ...subSubPage,
        paramPath: pageWithParamValue(subSubPage.path, params),
      })),
    })),
  })),
});
