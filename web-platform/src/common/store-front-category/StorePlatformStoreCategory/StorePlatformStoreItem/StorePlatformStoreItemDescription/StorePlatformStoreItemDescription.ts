import { PlatformStoreItemType } from '../common';

interface Props {
  type: PlatformStoreItemType;
}

export const StorePlatformStoreItemDescription = ({ type }: Props) => {
  return type === 'hard-currency'
    ? 'Want to support your favourite creator? Purchase Noice Credits and use them in creator stores.'
    : type === 'reshuffle-token'
    ? "Don't like the hand you've been dealt? Purchase Reshuffle Tokens and re-roll the cards."
    : type === 'standard-card-bundle'
    ? 'Show that you mean business. Purchase standard card bundles and level up your cards.'
    : '';
};
