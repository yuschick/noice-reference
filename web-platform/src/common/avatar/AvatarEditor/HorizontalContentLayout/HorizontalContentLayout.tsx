import { AvatarPart, Gender } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { useRef } from 'react';

import { AvatarComposition, ExtendedAvatarPart } from '../../types';
import { CategoryContent } from '../CategoryContent/CategoryContent';
import { CategorySelect } from '../CategorySelect/CategorySelect';
import { categories } from '../CategorySelect/constants';
import { AvatarTab, CategorySettings } from '../CategorySelect/types';
import { ExtendedAvatarPartCategory } from '../types';

import styles from './HorizontalContentLayout.module.css';

import { WalletWalletCurrency } from '@gen';

interface Props {
  avatarParts: ExtendedAvatarPart[];
  avatarComposition: Nullable<AvatarComposition>;
  selectedCategory: CategorySettings;
  currency?: WalletWalletCurrency;
  onSelect(part: AvatarPart): void;
  onSelectSet(setName: string, parts: AvatarPart[]): void;
  onSelectGender(gender: Gender): void;
  onSelectCategory(category: ExtendedAvatarPartCategory): void;
  onClear(): void;
}

export function HorizontalContentLayout({
  avatarParts,
  avatarComposition,
  selectedCategory,
  currency,
  onSelect,
  onSelectSet,
  onSelectGender,
  onSelectCategory,
  onClear,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (category: ExtendedAvatarPartCategory) => {
    onSelectCategory(category);

    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = 0;
  };

  return (
    <div className={styles.leftWrapper}>
      <div className={styles.navContainer}>
        <CategorySelect
          categories={categories.filter(
            (category) => category.tab === AvatarTab.Appearance,
          )}
          selectedCategory={selectedCategory.type}
          onCategorySelected={handleCategoryChange}
        />
        <CategorySelect
          categories={categories.filter((category) => category.tab === AvatarTab.Outfit)}
          selectedCategory={selectedCategory.type}
          onCategorySelected={handleCategoryChange}
        />
      </div>
      <div
        className={styles.leftContentScroller}
        ref={scrollRef}
      >
        <div className={styles.leftContentContainer}>
          <CategoryContent
            avatarComposition={avatarComposition}
            avatarParts={avatarParts}
            currency={currency}
            selectedCategory={selectedCategory}
            onClear={onClear}
            onSelect={onSelect}
            onSelectGender={onSelectGender}
            onSelectSet={onSelectSet}
          />
        </div>
      </div>
    </div>
  );
}
