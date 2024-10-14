import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  WatchQueryFetchPolicy,
} from '@apollo/client';
import { Nullable, Optional } from '@noice-com/utils';
import { useSearchParams } from 'react-router-dom';

import {
  TableModulePage,
  Props as TableModulePageProps,
} from '../TableModulePage/TableModulePage';

import { TableData } from '@common/table';
import { ButtonAction } from '@common/top-content';
import { ApiCursorInput, ApiPageInfo, InputMaybe, ItemItemTotalCount } from '@gen';

const PAGE_SIZE = 25;

interface PaginationOperationValues extends OperationVariables {
  cursor?: InputMaybe<ApiCursorInput>;
}

interface Props<TData, TVariables extends OperationVariables>
  extends Omit<TableModulePageProps, 'data' | 'fetchMore' | 'pagination'> {
  variables: Omit<TVariables, 'cursor'>;
  skip?: boolean;
  drawerFromQueryResult?: {
    title: string;
    getContentUsingQueryHook(result: QueryResult<TData, TVariables>): JSX.Element;
  };
  labelsFromQueryResult?: {
    countType: keyof ItemItemTotalCount;
    label: string;
    getLabelValueUsingQueryHook(
      countType: keyof ItemItemTotalCount,
      result: QueryResult<TData, TVariables>,
    ): number;
  }[];
  fetchPolicy?: WatchQueryFetchPolicy;
  getDrawerActionUsingQueryHook?(
    result: QueryResult<TData, TVariables>,
  ): Optional<Omit<ButtonAction, 'onClick'>>;
  hook(
    baseOptions?: QueryHookOptions<TData, TVariables> | undefined,
  ): QueryResult<TData, TVariables>;
  getPageInfo(data: TData): Nullable<ApiPageInfo>;
  dataTransform(data: TData): TableData;
}

export function PaginatedQueryTableModulePage<
  TData,
  TVariables extends PaginationOperationValues,
>({
  hook,
  dataTransform,
  getPageInfo,
  variables,
  skip,
  fetchPolicy,
  ...props
}: Props<TData, TVariables>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getCursor = () => {
    if (searchParams.get('after')) {
      return {
        cursor: { after: searchParams.get('after'), first: PAGE_SIZE },
      } as TVariables;
    }

    if (searchParams.get('before')) {
      return {
        cursor: { before: searchParams.get('before'), last: PAGE_SIZE },
      } as TVariables;
    }

    return { cursor: { first: PAGE_SIZE } } as TVariables;
  };

  const queryResult = hook({
    variables: { ...variables, ...getCursor() },
    skip,
    fetchPolicy,
  });

  const { data, error, loading } = queryResult;

  // Error cases: error or given data is null
  if (error || (data && !Object.values(data).filter((value) => !!value).length)) {
    return <TableModulePage.Error />;
  }

  const pageInfo = data ? getPageInfo(data) : null;

  const onNextPageClick = () => {
    if (!pageInfo) {
      return;
    }

    setSearchParams((prev) => {
      prev.set('after', pageInfo.endCursor);
      prev.delete('before');

      return prev;
    });
  };

  const onPreviousPageClick = () => {
    if (!pageInfo) {
      return;
    }

    setSearchParams((prev) => {
      prev.set('before', pageInfo.startCursor);
      prev.delete('after');

      return prev;
    });
  };

  const tableData = data ? dataTransform(data) : [];

  const drawer =
    props.drawerFromQueryResult && data
      ? {
          title: props.drawerFromQueryResult.title,
          content: props.drawerFromQueryResult.getContentUsingQueryHook(queryResult),
        }
      : props.drawer;

  const labels =
    props.labelsFromQueryResult && data
      ? props.labelsFromQueryResult?.map((label) => ({
          label: label.label,
          value: label.getLabelValueUsingQueryHook(label.countType, queryResult),
        }))
      : props.labels;

  const drawerActions = props.getDrawerActionUsingQueryHook
    ? props.getDrawerActionUsingQueryHook(queryResult)
    : props.drawerAction;

  return (
    <TableModulePage
      data={tableData}
      isLoading={loading}
      pagination={{
        onNextPageClick,
        onPreviousPageClick,
        hasNextPage: !!pageInfo?.hasNextPage,
        hasPreviousPage: !!pageInfo?.hasPreviousPage,
      }}
      {...props}
      drawer={drawer}
      drawerAction={drawerActions}
      labels={labels || []}
    />
  );
}
