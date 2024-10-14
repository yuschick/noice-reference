import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BiLinkExternal, BiMenu } from 'react-icons/bi';
import { useParams } from 'react-router';

import styles from './ContentWrapper.module.css';
import { ContextualBreadcrumbs } from './ContextualBreadcrumbs/ContextualBreadcrumbs';
import { ContextualSidebar } from './ContextualSidebar/ContextualSidebar';

import { Button, ExternalButtonLink, IconButton, Toggle } from '@common/button';
import { SelectFilter } from '@common/input';
import { ModuleBreadcrumb, PageWithPath } from '@common/module';
import { SidebarType } from '@common/sidebar';
import { useTopContent, useTopFilter } from '@common/top-content';
import { useSidebarState, useModule } from '@module-common';

const getTitle = (
  activePage: PageWithPath,
  activeBreadcrumb: Nullable<ModuleBreadcrumb>,
  titleSuffix: Nullable<string>,
) => {
  const title = `${activePage?.title}${titleSuffix ? ` ${titleSuffix}` : ''}`;

  // In sub sub page, add sub page title prefix to have more context
  if (activePage.path === activeBreadcrumb?.subSubPage?.path) {
    return `${activeBreadcrumb.subPage?.title} / ${title}`;
  }

  return title;
};

export function ContentWrapper({ children }: WithChildren) {
  const { activePage, activeBreadcrumb, setActivePathParams } = useModule();
  const { titleSuffix, labels, actions } = useTopContent();
  const { filters } = useTopFilter();
  const { toggleSidebar, sidebarOpen, hideStaticSidebar, sidebarType } =
    useSidebarState();

  const params = useParams();

  useEffect(() => {
    // Params are usable only inside router, so content wrapper takes care of them
    setActivePathParams(
      Object.entries(params).map(([param, value]) => ({
        param: `:${param}`,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value: value!,
      })),
    );
  }, [params, setActivePathParams]);

  if (!activePage) {
    return null;
  }

  const title = getTitle(activePage, activeBreadcrumb, titleSuffix);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <ContextualBreadcrumbs />

      <div
        className={classNames(styles.wrapper, {
          [styles.hasContextualSidebar]: sidebarType === SidebarType.Contextual,
        })}
      >
        {sidebarType === SidebarType.Contextual && (
          <ContextualSidebar className={styles.contextualSidebar} />
        )}

        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.titleAreaWrapper}>
              <div className={styles.titleWrapper}>
                {!hideStaticSidebar && (
                  <IconButton
                    icon={BiMenu}
                    text={`${sidebarOpen ? 'Close' : 'Open'} sidebar`}
                    onClick={toggleSidebar}
                  />
                )}

                <h1 className={styles.title}>{title}</h1>
              </div>

              {labels?.map(({ value, label }, index) => (
                <div
                  className={styles.result}
                  key={`result-${index}`}
                >
                  <span className={styles.value}>{value}</span>
                  <span className={styles.unit}>{label}</span>
                </div>
              ))}
            </div>

            {!!filters?.length && (
              <div className={styles.filters}>
                {filters.map((filter) => (
                  <SelectFilter
                    defaultValue={filter.defaultValue}
                    key={filter.label}
                    label={filter.label}
                    options={filter.options}
                    onChange={filter.onChange}
                  />
                ))}
              </div>
            )}

            {!!actions?.length && (
              <div className={styles.actions}>
                {actions?.map((action, index) => {
                  if (action.type === 'button') {
                    const { icon, text, onClick, ref, isDisabled } = action;

                    return (
                      <Button
                        disabled={isDisabled}
                        icon={icon}
                        key={index}
                        ref={ref}
                        text={text}
                        onClick={onClick}
                      />
                    );
                  }

                  if (action.type === 'link') {
                    const { text, href } = action;

                    return (
                      <ExternalButtonLink
                        buttonType="ghost"
                        href={href}
                        icon={BiLinkExternal}
                        key={index}
                        text={text}
                      />
                    );
                  }

                  if (action.type === 'toggle') {
                    const { label, onChange } = action;

                    return (
                      <Toggle
                        key={index}
                        label={label}
                        value={action.value}
                        onChange={onChange}
                      />
                    );
                  }
                })}
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
