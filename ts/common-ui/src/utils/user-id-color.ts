import { ProfileColor } from '@common-gen';

type Color = {
  name: string;
  hex: string;
};

export const chatUsernameColors: Color[] = [
  {
    hex: '#F69856',
    name: 'Orange',
  },
  {
    hex: '#F6CE56',
    name: 'Orange-Yellow',
  },
  {
    hex: '#F6F656',
    name: 'Yellow',
  },
  {
    hex: '#C0F656',
    name: 'Yellow-Green',
  },
  {
    hex: '#63F655',
    name: 'Green',
  },
  {
    hex: '#56F6C0',
    name: 'Teal',
  },
  {
    hex: '#6EC9F7',
    name: 'Blue',
  },
  {
    hex: '#8686F9',
    name: 'Violet',
  },
  {
    hex: '#B26AFB',
    name: 'Purple',
  },
  {
    hex: '#F76EF7',
    name: 'Pink',
  },
];

const chatUsernameColorValues = chatUsernameColors.map((color) => color.hex);

function generateUserIdHash(userId: string): number {
  let hash = 0;
  let chr = 0;

  if (userId.length === 0) {
    return hash;
  }

  for (let i = 0; i < userId.length; i++) {
    chr = userId.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return Math.abs(hash);
}

interface Props {
  preferredColor?: string;
  userId: string;
}

export function getUserIdColor({ preferredColor, userId }: Props): string {
  if (preferredColor && preferredColor !== ProfileColor.ColorUnspecified) {
    return preferredColor.replace('COLOR_', '#');
  }

  const userHash = generateUserIdHash(userId);
  const userColor = chatUsernameColorValues[userHash % chatUsernameColorValues.length];

  return userColor;
}
