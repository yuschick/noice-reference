import {
  CommonSoundKeys,
  useMouseEnterWithSound,
  VisuallyHidden,
  Tooltip,
  useMediaQuery,
  CommonUtils,
} from '@noice-com/common-ui';

import { ExtendedAvatarPartCategory } from '../types';

import styles from './CategorySelect.module.css';
import { CategorySettings } from './types';

import { usePlaySound } from '@common/sound';

interface Props {
  selectedCategory: ExtendedAvatarPartCategory;
  categories: CategorySettings[];
  onCategorySelected(category: ExtendedAvatarPartCategory): void;
}

export function CategorySelect({
  categories,
  selectedCategory,
  onCategorySelected,
}: Props) {
  const onMouseEnter = useMouseEnterWithSound();
  const [playButtonClickConfirmSound] = usePlaySound(CommonSoundKeys.ButtonClickConfirm);

  const disableTooltips = useMediaQuery(`(max-width: ${CommonUtils.getRem(699)})`);

  const handleCategorySelected = (category: ExtendedAvatarPartCategory) => {
    playButtonClickConfirmSound();
    onCategorySelected(category);
  };

  return (
    <div
      className={styles.wrapper}
      data-ftue-anchor="avatar-editor-categories"
    >
      {categories.map((category, i) => (
        <Tooltip
          content={category.name}
          delay={50}
          forceState={disableTooltips ? 'hide' : undefined}
          key={`button_${i}`}
          placement="right"
        >
          <button
            aria-current={selectedCategory === category.type ? 'true' : 'false'}
            aria-label={`Select ${category.name}`}
            className={styles.navItem}
            disabled={selectedCategory === category.type}
            id={`category_${category.type}`}
            onClick={() => handleCategorySelected(category.type)}
            onMouseEnter={onMouseEnter}
          >
            <category.icon className={styles.navIcon} />
            <VisuallyHidden>Select ${category.name}</VisuallyHidden>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
