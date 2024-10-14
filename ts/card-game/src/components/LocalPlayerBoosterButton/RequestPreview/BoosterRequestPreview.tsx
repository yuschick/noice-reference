import { gql } from '@apollo/client';
import classNames from 'classnames';
import { CSSProperties, useRef } from 'react';

import styles from './BoosterRequestPreview.module.css';

import { useBoosterRequestPreviewProfileQuery } from '@game-gen';

gql`
  query BoosterRequestPreviewProfile($id: ID!) {
    profile(userId: $id) {
      userId
      avatars {
        avatar2D
      }
    }
  }
`;

// This is the size of the booster minus the size of the avatar, so that we can place
// it randomly within the booster area without overlapping (since the translate origin
// is the center of the avatar if we just used the size of the avatar it would extend out)
const OFFSET_RANGE = 40 - 24;

const getRandomXOffset = () => {
  const min = Math.ceil(-OFFSET_RANGE);
  const max = Math.floor(OFFSET_RANGE);

  return Math.floor(Math.random() * (max - min) + min);
};

interface Props {
  userId: string;
  onDisappeared(userId: string): void;
}

export function BoosterRequestPreview({ userId, onDisappeared }: Props) {
  const startingOffset = useRef(getRandomXOffset());
  const { data, loading } = useBoosterRequestPreviewProfileQuery({
    variables: { id: userId },
  });

  if (loading || !data?.profile?.avatars?.avatar2D) {
    return null;
  }

  const handleAnimationEnd = () => onDisappeared(userId);

  return (
    <div
      className={classNames(styles.circleAvatar)}
      style={
        {
          '--anim-offset-x': `${startingOffset.current}px`,
          backgroundImage: `url(${data.profile.avatars.avatar2D})`,
        } as CSSProperties
      }
      onAnimationEndCapture={handleAnimationEnd}
    />
  );
}
