import { Nullable } from '@noice-com/utils';
import {
  Corner,
  getNodeAtPath,
  getOtherDirection,
  getPathToCorner,
  isParent,
  MosaicBranch,
  MosaicDirection,
  MosaicNode,
  MosaicParent,
  updateTree,
} from 'react-mosaic-component';

import { WidgetLayoutState, WidgetId } from '../../types';

type Parent<T extends string> = MosaicParent<T>;

type CreateAddUpdate = (
  id: WidgetId,
  layout?: WidgetLayoutState | null,
) => MosaicNode<WidgetId>;

/**
 * Reconstruct the path to given id. Recursive fun.
 *
 * @param node most likely our whole widgets -tree
 * @param id the branch to find
 */
export const getPath = <T extends string = WidgetId>(
  node: Parent<T>,
  id: T,
): MosaicBranch[] => {
  if (node.first === id) {
    return ['first'];
  }

  if (node.second === id) {
    return ['second'];
  }

  if (isParent(node)) {
    const firstTry = getPath<T>(node.first as Parent<T>, id);

    if (firstTry.length) {
      return ['first', ...firstTry];
    }

    const secondTry = getPath<T>(node.second as Parent<T>, id);

    if (secondTry.length) {
      return ['second', ...secondTry];
    }
  }

  return [];
};

export const isWidgetInLayout = (
  id: WidgetId,
  layout?: Nullable<WidgetLayoutState>,
): boolean =>
  layout ? getPath(layout.widgets as MosaicParent<WidgetId>, id).length > 0 : false;

/**
 * Creates a Mosaic tree update including a new branch. Adapted from original Mosaic docs at
 * @see https://github.com/nomcopter/react-mosaic/blob/HEAD/src/util/mosaicUpdates.ts
 *
 * Note: Currently always adds the node to Corner.TOP_RIGHT, which can be changed to whatever!
 * If there are no widgets enabled, use new branch as the new tree.
 *
 * @param id the widget id to add
 * @param layout with current tree
 */
export const createAddUpdate: CreateAddUpdate = (id, layout) => {
  if (!layout?.widgets) {
    return id;
  }

  const { widgets } = layout;
  const path = getPathToCorner(widgets, Corner.TOP_RIGHT);
  const parent = getNodeAtPath(widgets, path.slice(0, -1)) as MosaicParent<WidgetId>;
  const destination = getNodeAtPath(widgets, path) as MosaicNode<WidgetId>;
  const direction: MosaicDirection = parent ? getOtherDirection(parent.direction) : 'row';

  let first: MosaicNode<WidgetId>;
  let second: MosaicNode<WidgetId>;

  if (direction === 'row') {
    first = destination;
    second = id;
  } else {
    first = id;
    second = destination;
  }

  return updateTree(widgets, [
    {
      path,
      spec: {
        $set: {
          direction,
          first,
          second,
        },
      },
    },
  ]);
};
