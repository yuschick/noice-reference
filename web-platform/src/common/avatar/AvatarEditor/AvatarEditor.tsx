import { CoreAssets } from '@noice-com/assets-core';
import { useConditionalOnce } from '@noice-com/common-react-core';
import {
  Breakpoint,
  CommonUtils,
  ConfirmDialog,
  IconButton,
  LoadingSpinner,
  useAnalytics,
  useAuthenticatedUser,
  useBooleanFeatureFlag,
  useDialog,
  useWallet,
  WalletCurrencyId,
} from '@noice-com/common-ui';
import { AnalyticsEventClientInsufficientCreditsSource } from '@noice-com/schemas/analytics/analytics.pb';
import {
  AvatarPart,
  AvatarPartCategory,
  Gender,
} from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AvatarComposition, AvatarCustomisations, ExtendedAvatarPart } from '../types';

import { ActionButtons } from './ActionButtons/ActionButtons';
import { ActionDialog } from './ActionDialog/ActionDialog';
import styles from './AvatarEditor.module.css';
import { AvatarPreview } from './AvatarPreview/AvatarPreview';
import { categories } from './CategorySelect/constants';
import { ColorSelectors } from './ColorSelectors/ColorSelectors';
import { CategoryToEditorAnimation } from './constants';
import { useAnimatedAvatar } from './hooks/useAnimatedAvatar.hook';
import { useAvatarBuilder } from './hooks/useAvatarBuilder.hook';
import { useAvatarComposition } from './hooks/useAvatarComposition.hook';
import { useInventoryAvatarParts } from './hooks/useInventoryAvatarParts.hook';
import { useStoreAvatarParts } from './hooks/useStoreAvatarParts.hook';
import { HorizontalContentLayout } from './HorizontalContentLayout/HorizontalContentLayout';
import { PurchaseDialog } from './PurchaseDialog/PurchaseDialog';
import { SkinSelector } from './SkinSelector/SkinSelector';
import { ExtendedAvatarPartCategory, LocalCategories } from './types';
import { VerticalContentLayout } from './VerticalContentLayout/VerticalContentLayout';

import {
  UpSellingDialogSource,
  useImplicitAccountUpSellingAction,
} from '@common/implicit-account';
import { useConditionalWalletCanNotAffordDialog } from '@common/wallet';

interface Props {
  editorSessionId: string;
  avatarId?: string;
  onClose(): void;
  onSaveAndClose(
    avatarComposition: Nullable<AvatarComposition>,
    customisations: Nullable<AvatarCustomisations>,
  ): void;
}

export function AvatarEditor({
  avatarId,
  editorSessionId,
  onClose,
  onSaveAndClose,
}: Props) {
  const preventChanging = useRef<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedPart, setSelectedPart] = useState<Nullable<ExtendedAvatarPart>>(null);

  const {
    avatarParts: inventoryParts,
    loading: inventoryPartsLoading,
    reload: onReloadAvatarParts,
  } = useInventoryAvatarParts();
  const { isImplicitAccount } = useAuthenticatedUser();
  const { onAction } = useImplicitAccountUpSellingAction(
    UpSellingDialogSource.CustomizeAvatar,
  );

  const [storeEnabled, featureFlagLoading] = useBooleanFeatureFlag(
    'avatarEditor_cosmeticSales',
  );
  const { avatarParts: storeParts, loading: storePartsLoading } =
    useStoreAvatarParts(storeEnabled);

  const avatarPartsLoading =
    featureFlagLoading || inventoryPartsLoading || (storePartsLoading && storeEnabled);

  const avatarParts = useAvatarPartListMerge(inventoryParts, storeParts);

  const wallet = useWallet();
  const hardCurrency = wallet.currencies.find(
    (currency) => currency.currencyId === WalletCurrencyId.HardCurrency,
  );

  const [compositionPrice, setCompositionPrice] = useState<number>(0);

  const { trackEvent } = useAnalytics();

  const discardChangesDialogStore = useDialog({
    title: 'Discard changes',
    initialState: 'closed',
    options: {
      inlineSize: 'narrow',
      display: 'dialog',
    },
  });

  const randomiseOutfitDialogStore = useDialog({
    title: 'Randomise outfit',
    initialState: 'closed',
    options: {
      inlineSize: 'narrow',
      display: 'dialog',
    },
  });

  const confirmPurchaseDialogStore = useDialog({
    title: 'Confirm purchase',
    initialState: 'closed',
    options: {
      inlineSize: 'narrow',
      display: 'dialog',
      closeOnOutsideClick: false,
    },
  });

  const {
    actions,
    composition: avatarComposition,
    compositionHasChanged,
    customisations: avatarCustomisations,
    loading: avatarCompositionLoading,
    isInitialAvatarDefault,
  } = useAvatarComposition({
    avatarParts,
    avatarId,
  });

  const handleCompositionPrice = useCallback(
    (addedItem?: ExtendedAvatarPart) => {
      if (!avatarComposition) {
        return;
      }

      const composition = [
        ...Array.from(avatarComposition.values()),
        ...(addedItem ? [addedItem] : []),
      ];

      const compositionPrice = composition.reduce((prev, part) => {
        if (!part || !part.sellableItem?.igcPrices?.length) {
          return prev;
        }

        // Since we are selling now only with hard currency, we can just count them together
        return prev + part.sellableItem.igcPrices[0].amount;
      }, 0);

      setCompositionPrice(compositionPrice);
    },
    [avatarComposition],
  );

  const skus = useMemo(() => {
    return Array.from(avatarComposition?.values() || [])
      .map((part) => {
        return part?.sellableItem?.sku;
      })
      .filter((sku) => !!sku) as string[];
  }, [avatarComposition]);

  const handleConstructing = useCallback(
    (constructing: boolean) => {
      preventChanging.current = constructing;

      if (!constructing) {
        handleCompositionPrice();
      }
    },
    [handleCompositionPrice],
  );

  const { avatar, processing: avatarBuilderProcessing } = useAvatarBuilder({
    avatarComposition,
    avatarCustomisations,
    avatarParts,
    onConstructingAvatar: handleConstructing,
  });

  const { animatedAvatar } = useAnimatedAvatar({
    avatar,
  });

  const handleCategoryChange = useCallback((category: ExtendedAvatarPartCategory) => {
    setSelectedCategory(categories.find((c) => c.type === category) ?? categories[0]);
  }, []);

  const handleItemClear = useCallback(() => {
    if (preventChanging.current || avatarBuilderProcessing) {
      return;
    }

    actions.clearItem(selectedCategory.type as AvatarPartCategory);
  }, [actions, avatarBuilderProcessing, selectedCategory.type]);

  const handleItemChange = useCallback(
    (part: ExtendedAvatarPart) => {
      if (preventChanging.current || avatarBuilderProcessing) {
        return;
      }

      const changed = actions.changeItem(part);

      if (!changed) {
        return;
      }

      preventChanging.current = true;

      trackEvent({
        clientAvatarEditorItemSelected: { part, avatarEditorSessionId: editorSessionId },
      });

      if (!part.category) {
        return;
      }

      const animationCategory = CategoryToEditorAnimation.get(part.category);

      if (!animationCategory) {
        return;
      }

      animatedAvatar?.triggerAnimationByCategory(animationCategory);
      setSelectedPart(part);
    },
    [actions, editorSessionId, trackEvent, avatarBuilderProcessing, animatedAvatar],
  );

  const handleColorChange = useCallback(
    (part: AvatarPart) => {
      if (preventChanging.current || avatarBuilderProcessing) {
        return;
      }

      if (part.category !== AvatarPartCategory.CATEGORY_COLOR_PRESET) {
        handleItemChange(part);
        return;
      }

      const selectedCategoryPartId =
        avatarComposition?.get(selectedCategory.type)?.id ?? null;

      if (!selectedCategoryPartId || !part.id) {
        return;
      }

      actions.changeCustomisation(selectedCategoryPartId, {
        colorPreset: part.id,
        partId: selectedCategoryPartId,
      });

      trackEvent({
        clientAvatarEditorColorCustomisationSelected: {
          avatarEditorSessionId: editorSessionId,
          part,
          customisation: {
            colorPreset: part.id,
            partId: selectedCategoryPartId,
          },
        },
      });
    },
    [
      actions,
      avatarBuilderProcessing,
      selectedCategory.type,
      avatarComposition,
      editorSessionId,
      handleItemChange,
      trackEvent,
    ],
  );

  const handleSkinSelect = useCallback(
    (part: AvatarPart) => {
      const selectedCategoryPartId =
        avatarComposition?.get(selectedCategory.type)?.id ?? null;

      if (!selectedCategoryPartId || !part.id) {
        return;
      }

      if (part.id === selectedCategoryPartId) {
        actions.removeCustomisation(part.id, 'skin');
        return;
      }

      actions.changeCustomisation(selectedCategoryPartId, {
        skin: part.id,
        partId: selectedCategoryPartId,
      });
    },
    [avatarComposition, selectedCategory.type, actions],
  );

  const handleGenderSelect = useCallback(
    (gender: Gender) => {
      if (preventChanging.current || avatarBuilderProcessing) {
        return;
      }

      actions.changeGender(gender);
    },
    [avatarBuilderProcessing, actions],
  );

  const handleSelectSet = (_setName: string, parts: AvatarPart[]) => {
    if (preventChanging.current || avatarBuilderProcessing) {
      return;
    }

    preventChanging.current = true;

    actions.equipClothingSet(parts);
  };

  const handleOpenDiscardChangesDialog = useCallback(() => {
    discardChangesDialogStore.actions.open();
  }, [discardChangesDialogStore]);

  const handleOpenRandomiseOutfitDialog = useCallback(() => {
    randomiseOutfitDialogStore.actions.open();
  }, [randomiseOutfitDialogStore]);

  const handleSaveAndClose = useCallback(() => {
    if (isImplicitAccount) {
      onAction();
      return;
    }

    onSaveAndClose(avatarComposition, avatarCustomisations);
  }, [
    isImplicitAccount,
    onSaveAndClose,
    avatarComposition,
    avatarCustomisations,
    onAction,
  ]);

  const { dialogStore: cantAffordDialogStore, onPurchaseClick: handlePurchase } =
    useConditionalWalletCanNotAffordDialog({
      currencyAmount: compositionPrice,
      currencyId: WalletCurrencyId.HardCurrency,
      onCanAffordPurchase: confirmPurchaseDialogStore.actions.open,
      skus,
      source: AnalyticsEventClientInsufficientCreditsSource.SOURCE_AVATAR_EDITOR,
    });

  useEffect(() => {
    handleCategoryChange(
      isInitialAvatarDefault
        ? AvatarPartCategory.CATEGORY_HEAD
        : LocalCategories.CATEGORY_OUTFIT,
    );
  }, [handleCategoryChange, isInitialAvatarDefault]);

  useAvatarPartFromSearch(
    avatarParts,
    useCallback(
      (part) => {
        part.category && handleCategoryChange(part.category);
        handleItemChange(part);
      },
      [handleCategoryChange, handleItemChange],
    ),
    !avatarPartsLoading && !(preventChanging.current || avatarBuilderProcessing),
  );

  const isLoading = avatarPartsLoading || avatarCompositionLoading;

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Breakpoint query={`(min-width: ${CommonUtils.getRem(700)})`}>
        <HorizontalContentLayout
          avatarComposition={avatarComposition}
          avatarParts={avatarParts}
          currency={hardCurrency}
          selectedCategory={selectedCategory}
          onClear={handleItemClear}
          onSelect={handleItemChange}
          onSelectCategory={handleCategoryChange}
          onSelectGender={handleGenderSelect}
          onSelectSet={handleSelectSet}
        />
      </Breakpoint>
      <Breakpoint query={`(max-width: ${CommonUtils.getRem(699)})`}>
        <VerticalContentLayout
          avatarComposition={avatarComposition}
          avatarParts={avatarParts}
          currency={hardCurrency}
          selectedCategory={selectedCategory}
          onClear={handleItemClear}
          onSelect={handleItemChange}
          onSelectCategory={handleCategoryChange}
          onSelectGender={handleGenderSelect}
          onSelectSet={handleSelectSet}
        />
      </Breakpoint>

      <div className={styles.rightColumn}>
        <AvatarPreview
          animatedAvatar={animatedAvatar}
          cameraSettings={selectedCategory.cameraSettings}
          isLoading={avatarBuilderProcessing}
        />

        <ActionButtons
          cost={
            compositionPrice
              ? { currency: WalletCurrencyId.HardCurrency, amount: compositionPrice }
              : undefined
          }
          isAvatarChanged={compositionHasChanged}
          onClose={onClose}
          onDiscardChanges={handleOpenDiscardChangesDialog}
          onPurchase={handlePurchase}
          onSaveAndClose={handleSaveAndClose}
        />

        <div className={styles.customisationSelectors}>
          <ColorSelectors
            avatarComposition={avatarComposition}
            avatarCustomisations={avatarCustomisations}
            avatarParts={avatarParts}
            selectedCategory={selectedCategory}
            onSelect={handleColorChange}
          />

          <SkinSelector
            avatarComposition={avatarComposition}
            avatarCustomisations={avatarCustomisations}
            avatarParts={avatarParts}
            selectedCategory={selectedCategory}
            onSelect={handleSkinSelect}
          />
        </div>

        <div className={styles.randomiseButton}>
          <IconButton
            icon={CoreAssets.Icons.Randomise}
            label="Randomize outfit"
            level="secondary"
            shape="circle"
            onClick={handleOpenRandomiseOutfitDialog}
          />
        </div>
      </div>

      <ActionDialog
        description="Are you sure you want to discard your changes?"
        dialogStore={discardChangesDialogStore}
        title="Discard changes"
        onYesClicked={actions.revert}
      />

      <ActionDialog
        description="Are you sure you want to randomize your outfit?"
        dialogStore={randomiseOutfitDialogStore}
        title="Randomize Outfit"
        onYesClicked={actions.randomize}
      />

      <PurchaseDialog
        composition={avatarComposition}
        dialogStore={confirmPurchaseDialogStore}
        selectedItem={selectedPart}
        onItemsBought={handleSaveAndClose}
        onReloadAvatarParts={onReloadAvatarParts}
      />

      <ConfirmDialog store={cantAffordDialogStore} />
    </div>
  );
}

function useAvatarPartFromSearch(
  parts: AvatarPart[],
  setPart: (part: AvatarPart) => void,
  ready: boolean,
) {
  const [params, setParams] = useSearchParams();

  useConditionalOnce(() => {
    const partID = params.get('part_id');
    const part = parts.find((p) => p.id === partID);

    if (partID) {
      const newParams = new URLSearchParams(params);
      newParams.delete('part_id');
      setParams(newParams.toString(), { replace: true });
    }

    if (!part) {
      return;
    }

    setPart(part);
  }, ready);
}

function useAvatarPartListMerge(
  inventoryParts: ExtendedAvatarPart[],
  storeParts: ExtendedAvatarPart[],
) {
  return useMemo(() => {
    const newParts = [...inventoryParts, ...storeParts] as ExtendedAvatarPart[];
    const seen: { [key: string]: boolean } = {};

    const unique = newParts.filter((part) => {
      if (!part.id) {
        return false;
      }

      if (seen[part.id]) {
        return false;
      }

      seen[part.id] = true;
      return true;
    });

    // Move items with channelId to the top
    unique.sort((a, b) => {
      if (a.channelId && !b.channelId) {
        return -1;
      }

      if (!a.channelId && b.channelId) {
        return 1;
      }

      return 0;
    });

    return unique;
  }, [inventoryParts, storeParts]);
}
