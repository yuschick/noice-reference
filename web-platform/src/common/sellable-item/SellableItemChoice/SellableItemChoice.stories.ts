import { BiGroup } from 'react-icons/bi';

import { SelectableSellableItem, SellableItemChoice } from './SellableItemChoice';

export default {
  component: SellableItemChoice,
  argTypes: {},
};

const items: SelectableSellableItem[] = [
  {
    id: '1',
    itemName: 'Test 1',
    icon: BiGroup,
    formattedPrice: 'US$100',
    formattedOriginalPrice: 'US$500',
  },
  {
    id: '2',
    itemName: 'Test 2',
    icon: BiGroup,
    formattedPrice: 'US$200',
    formattedOriginalPrice: undefined,
  },
  {
    id: '3',
    itemName: 'Test 3',
    icon: BiGroup,
    formattedPrice: 'US$300',
    formattedOriginalPrice: undefined,
  },
];

export const Default = {
  args: {
    items: items,
    selectedItemId: '1',
    onSelect: () => {},
  },
};
