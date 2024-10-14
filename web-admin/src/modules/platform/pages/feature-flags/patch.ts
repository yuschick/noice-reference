import { Operation } from 'rfc6902';

export interface Stats {
  add: number;
  remove: number;
  replace: number;
  move: number;
  copy: number;
  rootIsNew: boolean;
}

export const filter = (operations: Operation[], pathPrefix: string): Operation[] => {
  return (
    operations
      // Get the operations that start with the path prefix
      .filter((operation) => operation.path.startsWith(pathPrefix))
      // Remove the path prefix from the path
      .map((operation) => ({
        ...operation,
        path: operation.path.slice(pathPrefix.length),
      }))
  );
};

export const stats = (operations: Operation[]): Stats => {
  const stats = {
    add: 0,
    remove: 0,
    replace: 0,
    move: 0,
    copy: 0,
    test: 0,
    rootIsNew: false,
  };

  operations.forEach((operation) => {
    stats[operation.op]++;

    if (operation.path === '' && operation.op === 'add') {
      stats.rootIsNew = true;
    }
  });

  return stats;
};
