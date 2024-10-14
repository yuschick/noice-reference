import { AvatarPart, Gender } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';

import { AvatarComposition, ExtendedAvatarPart } from '../../types';
import { CategoryTitle } from '../CategoryTitle/CategoryTitle';
import { GenderSelection } from '../Heads/GenderSelection/GenderSelection';
import { Heads } from '../Heads/Heads';
import { getCompositionGender } from '../utils';

import { Body } from './Body/Body';
import styles from './BodyAndHead.module.css';

import { WalletWalletCurrency } from '@gen';

interface Props {
  avatarParts: ExtendedAvatarPart[];
  currency?: WalletWalletCurrency;
  avatarComposition: Nullable<AvatarComposition>;
  onSelect(part: AvatarPart): void;
  onSelectGender(gender: Gender): void;
}

export function BodyAndHead({
  avatarParts,
  currency,
  avatarComposition,
  onSelect,
  onSelectGender,
}: Props) {
  return (
    <div className={styles.bodyAndHeadContainer}>
      <CategoryTitle
        currency={currency}
        title={'Customize Avatar'}
      />
      <GenderSelection
        selectedGender={getCompositionGender(avatarComposition)}
        onSelectedGender={onSelectGender}
      />

      <Heads
        avatarComposition={avatarComposition}
        avatarParts={avatarParts}
        onSelect={onSelect}
      />

      <Body
        avatarComposition={avatarComposition}
        avatarParts={avatarParts}
        onSelect={onSelect}
      />
    </div>
  );
}
