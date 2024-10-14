import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useEffect, useState } from 'react';

import { ExtendedAvatarPart } from '../../types';

import {
  AvatarEditorSellableItemFragment,
  AvatarEditorSellableItemFragmentDoc,
  useAvatarEditorAvatarPartsQuery,
} from '@gen';

gql`
  fragment AvatarEditorAvatarPart on AvatarAvatarPart {
    id
    color
    url
    colors
    experimental
    colorPresetOptions
    glbUrlOverride {
      category
      glbUrl
    }
    userDefault
    uniqueBootstrap
    skinOptions
    skinData {
      baseMapUrl
      normalMapUrl
      ormMapUrl
      emissionMapUrl
    }
    enabled
    channelId
    sellable
  }
`;

gql`
  fragment AvatarEditorSellableItem on StoreV2SellableItem {
    id
    sku
    signature
    price {
      currency
      amount
      amountWithoutDiscount
    }
    igcPrices {
      currencyId
      amount
      amountWithoutDiscount
    }
    content {
      value {
        ... on StoreV2ItemRef {
          __typename
          count
          item {
            id
            gameId
            type
            attributes {
              value {
                key
                value {
                  value {
                    ... on StringType {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

gql`
  query AvatarEditorAvatarParts {
    avatarEditorStoreFront {
      id
      gameId
      categories {
        id
        ... on StoreV2StoreFrontCategory {
          id
          itemType
          sellableItems {
            ...AvatarEditorSellableItem
          }
        }
      }
    }
  }

  ${AvatarEditorSellableItemFragmentDoc}
`;

export function useStoreAvatarParts(enabled = true) {
  const cli = useClient();

  const { data, loading } = useAvatarEditorAvatarPartsQuery({
    skip: !enabled,
  });

  const [parts, setParts] = useState<ExtendedAvatarPart[]>([]);
  const [loadingParts, setLoadingParts] = useState<boolean>(true);

  useEffect(() => {
    if (loading || !data || !data.avatarEditorStoreFront?.categories?.length) {
      return;
    }

    const sellableItemLookupMap = new Map<string, AvatarEditorSellableItemFragment>();

    const ids = data.avatarEditorStoreFront?.categories[0].sellableItems.map((item) => {
      let id = '';
      const content = item.content[0];
      if (content.value?.__typename === 'StoreV2ItemRef') {
        const avatarPartIDArg = content.value.item.attributes.value.find((arg) => {
          return arg.key === 'avatar_part_id';
        });
        if (avatarPartIDArg && avatarPartIDArg.value.value?.__typename === 'StringType') {
          id = avatarPartIDArg.value.value.value;
          sellableItemLookupMap.set(id, item);
        }
      }

      return id;
    });

    let mounted = true;
    const load = async () => {
      const parts = await cli.AvatarService.batchGetAvatarParts(ids);
      if (!mounted) {
        return;
      }
      setParts(
        parts.map((part) => {
          const sellableItem = sellableItemLookupMap.get(part.id ?? '');

          return {
            ...part,
            sellableItem,
          };
        }),
      );
      setLoadingParts(false);
    };
    load();

    return () => {
      mounted = false;
    };
  }, [cli.AvatarService, data, loading]);

  return { avatarParts: parts, loading: loading || loadingParts };
}
