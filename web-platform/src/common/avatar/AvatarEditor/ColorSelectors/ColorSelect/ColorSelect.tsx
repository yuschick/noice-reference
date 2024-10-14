import { VisuallyHidden } from '@noice-com/common-ui';
import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';

import styles from './ColorSelect.module.css';

interface Props {
  selectedId: Nullable<string>;
  colors: AvatarPart[];
  columnLength: number;

  onSelect(color: AvatarPart): void;
}

export function ColorSelect({ selectedId, colors, columnLength, onSelect }: Props) {
  return (
    <div className={styles.colorSelectContainer}>
      <span className={styles.titleText}>Color</span>
      <div
        className={styles.skinColor}
        style={{ gridTemplateRows: `repeat(${columnLength}, auto)` }}
      >
        {colors.map((color, index) => {
          const displayedColors = color.color
            ? [color.color]
            : color.colors
            ? color.colors
            : ['#ff0000'];

          return (
            <button
              aria-current={color.id === selectedId ? 'true' : 'false'}
              aria-label={`Change color to ${color.name}`}
              className={classNames(styles.colorButton, {
                [styles.selected]: color.id === selectedId,
              })}
              key={`${color.id}-${index}`}
              onClick={() => color.id && onSelect(color)}
            >
              {displayedColors.map((color, colorIndex) => (
                <div
                  className={styles.colorContainer}
                  key={`color_${index}_${colorIndex}`}
                  style={{
                    backgroundColor: color,
                    marginInlineStart: `${-12 * colorIndex}px`,
                  }}
                />
              ))}
              <VisuallyHidden>Change color to {color.name}</VisuallyHidden>
            </button>
          );
        })}
      </div>
    </div>
  );
}
