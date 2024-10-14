import { Icon, VisuallyHidden } from '@noice-com/common-ui';
import { StringUtils } from '@noice-com/utils';
import classNames from 'classnames';
import { RefObject } from 'react';
import { BiCheckCircle, BiMehBlank, BiMinusCircle } from 'react-icons/bi';

import { TableData, TableDataModel } from '../types';

import styles from './Table.module.css';

import { PermissionLink } from '@common/permission';

export interface TableProps {
  caption: string;
  data: TableData;
  idField?: string;
  includeIdField?: boolean;
  contentRef?: RefObject<HTMLTableSectionElement>;
  minifyCells?: string[];
  hiddenHeaders?: string[];
  generateLinkToFromId?(id: TableDataModel): string;
  onRowClick?(id: TableDataModel): void;
}

export function Table({
  caption,
  data,
  idField,
  includeIdField,
  contentRef,
  onRowClick,
  minifyCells,
  hiddenHeaders,
  generateLinkToFromId,
}: TableProps) {
  const rows = data.map((entry, index) => ({
    data: Object.entries(entry)
      .filter(([key]) => key !== 'className')
      .filter(([key]) => (includeIdField ? true : key !== idField))
      .map(([label, value]) => ({
        label: StringUtils.normalizePropertyName(label),
        key: label,
        value,
      })),
    id: idField ? entry[idField] || `${index}` : `${index}`,
    className: entry.className,
  }));

  const headers = rows.length ? rows[0].data : [];

  if (!rows.length) {
    return (
      <>
        <div className={styles.noResults}>
          <Icon
            className={styles.icon}
            icon={BiMehBlank}
          />
          <span>No results</span>
        </div>
      </>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <caption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </caption>

        <thead className={styles.head}>
          <tr>
            {headers.map(({ label, key }) => (
              <th
                className={classNames(styles.headCell, {
                  [styles.minifiedCell]: minifyCells?.includes(key),
                })}
                key={key}
              >
                {hiddenHeaders?.includes(key) ? (
                  <VisuallyHidden>{label}</VisuallyHidden>
                ) : (
                  <span>{label}</span>
                )}
              </th>
            ))}

            {onRowClick && (
              <th>
                <VisuallyHidden>Row action</VisuallyHidden>
              </th>
            )}

            {!!generateLinkToFromId && (
              <th>
                <VisuallyHidden>Row link</VisuallyHidden>
              </th>
            )}
          </tr>
        </thead>

        <tbody ref={contentRef}>
          {rows.map((row, rowIndex) => (
            <tr
              className={classNames(styles.row, row.className, {
                [styles.clickable]: !!onRowClick || !!generateLinkToFromId,
              })}
              key={rowIndex}
              onClick={() => onRowClick?.(row.id)}
            >
              {row.data.map(({ label, value, key }, index) => (
                <td
                  className={classNames(styles.dataCell, {
                    [styles.minifiedCell]: minifyCells?.includes(key),
                  })}
                  key={index}
                >
                  <span
                    className={styles.label}
                    data-label={label}
                  />
                  <span>
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Icon
                          className={styles.trueIcon}
                          icon={BiCheckCircle}
                          size={18}
                        />
                      ) : (
                        <Icon
                          className={styles.falseIcon}
                          icon={BiMinusCircle}
                          size={18}
                        />
                      )
                    ) : (
                      value
                    )}
                  </span>
                </td>
              ))}

              {onRowClick && (
                <td>
                  <VisuallyHidden>
                    <button
                      type="button"
                      onClick={() => onRowClick(row.id)}
                    >
                      Open {row.data[0].value}
                    </button>
                  </VisuallyHidden>
                </td>
              )}

              {generateLinkToFromId && (
                <td>
                  <PermissionLink
                    className={styles.rowLink}
                    to={generateLinkToFromId(row.id)}
                  >
                    <VisuallyHidden>Show more</VisuallyHidden>
                  </PermissionLink>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.Loading = () => {
  return (
    <div className={styles.loadingTable}>
      <div className={styles.loadingHeader} />

      <div>
        {new Array(15).fill(null).map((_, index) => (
          <div
            className={styles.loadingBody}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};
