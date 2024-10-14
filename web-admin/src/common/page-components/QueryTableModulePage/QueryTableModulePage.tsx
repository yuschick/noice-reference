import { OperationVariables, QueryResult } from '@apollo/client';

import {
  TableModulePage,
  Props as TableModulePageProps,
} from '../TableModulePage/TableModulePage';

import { TableData } from '@common/table';

interface Props<TData, TVariables extends OperationVariables>
  extends Omit<TableModulePageProps, 'data' | 'pagination'> {
  queryResult: QueryResult<TData, TVariables>;
  dataTransform(data: TData): TableData;
}

export function QueryTableModulePage<TData, TVariables extends OperationVariables>({
  queryResult,
  dataTransform,
  ...props
}: Props<TData, TVariables>) {
  const { data, error, loading } = queryResult;

  // Error cases are error, no data or given data is null
  if (error || (data && !Object.values(data).filter((value) => !!value).length)) {
    return <TableModulePage.Error />;
  }

  const tableData = data ? dataTransform(data) : [];

  return (
    <TableModulePage
      data={tableData}
      isLoading={loading}
      {...props}
    />
  );
}
