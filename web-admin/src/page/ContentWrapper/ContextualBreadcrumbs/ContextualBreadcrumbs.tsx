import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { StringUtils } from '@noice-com/utils';
import { Fragment } from 'react';
import { generatePath, matchRoutes, useLocation, useParams } from 'react-router';

import styles from '../ContentWrapper.module.css';

import { Breadcrumbs, BreadcrumbsItem } from './Breadcrumbs';

import { useBreadcrumbsUserQuery, useBreadcrumbsChannelQuery } from '@gen';
import { routes } from '@modules';

gql`
  query BreadcrumbsUser($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;
gql`
  query BreadcrumbsChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

export function ContextualBreadcrumbs() {
  const params = useParams();
  const location = useLocation();
  const matchedRoute = matchRoutes(routes, location)?.[0];

  const { data: userData } = useBreadcrumbsUserQuery({
    ...variablesOrSkip({ userId: params.userId }),
  });
  const { data: channelData } = useBreadcrumbsChannelQuery({
    ...variablesOrSkip({ channelId: params.channelId }),
  });

  const routePathParts =
    matchedRoute?.route.path.split('/').filter((path) => path !== '*') || [];

  const createParamBreadcrumb = (param: string, isLastPage: boolean): JSX.Element => {
    switch (param) {
      case ':userId':
        if (!params.userId) {
          return <Fragment key={param} />;
        }

        return (
          <BreadcrumbsItem
            isCurrentPage={isLastPage}
            key={param}
            to={generatePath(`/users/${param}`, { userId: params.userId })}
          >
            {userData?.profile?.userTag}
          </BreadcrumbsItem>
        );

      case ':channelId':
        if (!params.channelId) {
          return <Fragment key={param} />;
        }

        return (
          <BreadcrumbsItem
            isCurrentPage={isLastPage}
            key={param}
            to={generatePath(`/channels/${param}`, { channelId: params.channelId })}
          >
            {channelData?.channel?.name}
          </BreadcrumbsItem>
        );
    }

    return <Fragment key={param}></Fragment>;
  };

  return routePathParts.length > 1 ? (
    <div className={styles.breadcrumbsWrapper}>
      <Breadcrumbs>
        {routePathParts.map((urlPart, index) => {
          const isFirstPage = index === 0;
          const isLastPage = index === routePathParts.length - 1;
          const isParamPart = urlPart.startsWith(':');

          return isParamPart ? (
            createParamBreadcrumb(urlPart, isLastPage)
          ) : (
            <BreadcrumbsItem
              isCurrentPage={isLastPage}
              key={urlPart}
              {...(isFirstPage ? { to: `/${urlPart}` } : {})}
            >
              {StringUtils.normalizePropertyName(urlPart)}
            </BreadcrumbsItem>
          );
        })}
      </Breadcrumbs>
    </div>
  ) : null;
}
