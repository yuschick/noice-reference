import { GameCard } from '@game-card';
import { GameCardFragment } from '@game-gen';

interface Props {
  card: GameCardFragment;
  className?: string;
  disabled?: boolean;
  onCardSelected(card: GameCardFragment): void;
  onFocus?(): void;
  onBlur?(): void;
}

export function CardSelectCardButton({
  card,
  className,
  disabled,
  onCardSelected,
  onFocus,
  onBlur,
}: Props) {
  return (
    <div className={className}>
      <GameCard
        as="button"
        card={card}
        isDisabled={disabled}
        onBlur={onBlur}
        onClick={() => onCardSelected(card)}
        onFocus={onFocus}
      />
    </div>
  );
}

CardSelectCardButton.Loading = GameCard.Loading;
