import { useCallback } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

import { ModulePage, Props as ModulePageProps } from '../ModulePage/ModulePage';

import styles from './TableModulePage.module.css';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { Table, TableProps } from '@common/table';

export interface Props
  extends Omit<ModulePageProps, 'children'>,
    Omit<TableProps, 'contentRef'> {
  tableUnit?: string;
  openDrawerOnRowClick?: boolean;
  pagination?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onNextPageClick(): void;
    onPreviousPageClick(): void;
  };
  isLoading?: boolean;
}

export function TableModulePage({
  data,
  labels,
  tableUnit,
  idField,
  openDrawerOnRowClick,
  pagination,
  isLoading,
  includeIdField,
  onRowClick: onRowClickCallback,
  ...props
}: Props) {
  const { openDrawer } = useDrawer();

  const resultsWithArrayData = tableUnit
    ? [
        ...(labels ?? []),
        {
          label: tableUnit,
          value: data.length,
        },
      ]
    : labels;

  const onRowClick = useCallback(
    (rowId: string) => {
      if (onRowClickCallback) {
        onRowClickCallback(rowId);
      }

      if (openDrawerOnRowClick) {
        openDrawer(rowId);
      }
    },
    [onRowClickCallback, openDrawer, openDrawerOnRowClick],
  );

  return (
    <ModulePage
      {...props}
      labels={resultsWithArrayData}
    >
      <div className={styles.wrapper}>
        {!isLoading ? (
          <Table
            caption={props.caption}
            data={data}
            generateLinkToFromId={props.generateLinkToFromId}
            hiddenHeaders={props.hiddenHeaders}
            idField={idField}
            includeIdField={includeIdField}
            minifyCells={props.minifyCells}
            onRowClick={
              openDrawerOnRowClick || onRowClickCallback ? onRowClick : undefined
            }
          />
        ) : (
          <Table.Loading />
        )}

        {pagination && (pagination.hasNextPage || pagination.hasPreviousPage) && (
          <div className={styles.pagination}>
            <Button
              buttonType="ghost"
              disabled={!pagination.hasPreviousPage}
              icon={BiChevronLeft}
              size="small"
              text="Previous"
              onClick={pagination.onPreviousPageClick}
            />

            <Button
              buttonType="ghost"
              disabled={!pagination.hasNextPage}
              icon={BiChevronRight}
              size="small"
              text="Next"
              onClick={pagination.onNextPageClick}
            />
          </div>
        )}
      </div>
    </ModulePage>
  );
}

TableModulePage.Error = () => {
  return <ModulePage.Error />;
};
