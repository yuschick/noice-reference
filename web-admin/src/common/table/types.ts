export type TableDataModel = string | number | boolean | undefined | JSX.Element;

export type TableData = Record<string, TableDataModel>[] & { className?: string };
