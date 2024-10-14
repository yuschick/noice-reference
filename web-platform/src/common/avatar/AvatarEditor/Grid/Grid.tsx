import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

import styles from './Grid.module.css';
import { Clear } from './GridItem/Clear/Clear';
import { GridItem } from './GridItem/GridItem';
import { Part } from './GridItem/Part/Part';

import { ExtendedAvatarPart } from '@common/avatar/types';

interface Props {
  label: string;
  selectedPartId: Nullable<string>;
  avatarParts: Nullable<ExtendedAvatarPart[]>;
  isClearable?: boolean;
  onSelect(part: AvatarPart): void;
  onClear(): void;
}

export function Grid({
  label,
  selectedPartId,
  avatarParts,
  isClearable,
  onSelect,
  onClear,
}: Props) {
  return (
    <div className={styles.gridContent}>
      <div className={styles.gridTitle}>{label}</div>
      <div className={styles.grid}>
        <div className={styles.gridItems}>
          {!!isClearable && (
            <GridItem
              selected={!selectedPartId}
              onClick={onClear}
            >
              <Clear selected={!selectedPartId} />
            </GridItem>
          )}

          {avatarParts?.map((part, index) => {
            const { id: partId } = part;

            if (!partId) {
              return null;
            }

            return (
              <GridItem
                key={`item_${index}_${partId}`}
                selected={selectedPartId === partId}
                style={getStyle(part)}
                onClick={() => onSelect(part)}
              >
                <Part
                  part={part}
                  selected={selectedPartId === partId}
                />
              </GridItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getStyle(part: ExtendedAvatarPart): 'standard' | 'premium' | 'purchaseable' {
  if (part.sellableItem?.igcPrices?.length) {
    return 'purchaseable';
  }

  if (part.channelId) {
    return 'premium';
  }

  return 'standard';
}
