import { useMountEffect } from '@noice-com/common-react-core';
import {
  ButtonLink,
  CommonUtils,
  Dialog,
  Image,
  useAnalytics,
  useDialog,
} from '@noice-com/common-ui';
import { AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction } from '@noice-com/schemas/analytics/analytics.pb';
import { generatePath } from 'react-router';

import { CosmeticsPurchaseItem } from '../types';

import styles from './PurchaseCompleteDialog.module.css';

import { Routes } from '@common/route';
import { AvatarAvatarPart, StoreV2ItemRef } from '@gen';

interface Props {
  item: CosmeticsPurchaseItem;
  progressPurchaseStage: () => void;
}

export function PurchaseCompleteDialog({ item, progressPurchaseStage }: Props) {
  const avatarEditorPreviewUrl = generatePath(
    `${Routes.Avatar}?part_id=${item.sku.replace('avatar-part-', '')}`,
  );

  const store = useDialog({
    title: 'Purchase Completed',
    onClose: progressPurchaseStage,
  });

  const { trackEvent } = useAnalytics();

  const previewUrl =
    ((item.content[0].value as StoreV2ItemRef).item?.details as AvatarAvatarPart)
      ?.previewImgUrl ?? '';

  const handleCustomizeAvatar = () => {
    trackEvent({
      clientStoreAvatarCosmeticsPurchaseDialog: {
        action:
          AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction.ACTION_BUTTON_CLICK_PURCHASE_COMPLETE_CUSTOMIZE_AVATAR,
        price: item.igcPrices?.[0]?.amount ?? 0,
        id: item.id,
        name: item.name,
      },
    });
  };

  useMountEffect(() => {
    store.actions.open();
  });

  return (
    <Dialog store={store}>
      <Dialog.Close />
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.purchaseCompleteWrapper}>
          <p className={styles.acquiredText}>Item acquired</p>
          <div className={styles.purchaseCompleteContentWrapper}>
            <Image
              alt={item.name}
              className={styles.previewImage}
              loadingType="none"
              sizes={`${CommonUtils.getRem(150)}`}
              src={previewUrl}
            />
            <div className={styles.detailsWrapper}>
              <span className={styles.itemName}>
                {item.name.replace('Avatar Part', '')}
              </span>
              <div>Creator Cosmetic</div>
            </div>
          </div>
          <p>Equip the cosmetic in the Avatar Editor and show it off.</p>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <div className={styles.actionsWrapper}>
          <ButtonLink
            theme="dark"
            to={avatarEditorPreviewUrl}
            onClick={handleCustomizeAvatar}
          >
            Edit and Equip
          </ButtonLink>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
