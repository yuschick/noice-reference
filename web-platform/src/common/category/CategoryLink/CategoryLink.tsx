import { gql } from '@apollo/client';
import { Image, LoadingSkeleton } from '@noice-com/common-ui';
import { Link } from 'react-router-dom';

import { getCategoryLink } from '../utils';

import styles from './CategoryLink.module.css';

import CategoryImagePlaceHolder from '@assets/images/category-placeholder.webp';
import { AppSoundKeys, usePlaySound } from '@common/sound';
import { CategoryLinkGameStatsFragment } from '@gen';

gql`
  fragment CategoryLinkGameStats on ChannelGameStats {
    gameId
    liveStreams
    game {
      id
      name
      coverImageUrl
    }
  }
`;

interface Props {
  category: CategoryLinkGameStatsFragment;
  onClick?(): void;
}

export function CategoryLink({ category, onClick }: Props) {
  const { liveStreams, gameId, game } = category;
  const { name, coverImageUrl } = game;

  const [playHoverSound] = usePlaySound(AppSoundKeys.GenericHover);

  return (
    <Link
      aria-label={`Browse channel's for category ${name}`}
      className={styles.categoryLink}
      to={getCategoryLink(gameId)}
      onClick={onClick}
      onMouseEnter={() => playHoverSound()}
    >
      <Image
        alt={name}
        className={styles.categoryLinkImage}
        fit="cover"
        height={121}
        src={coverImageUrl ? coverImageUrl : CategoryImagePlaceHolder}
        width={216}
      />

      <div className={styles.categoryLinkContent}>
        <span className={styles.categoryLinkName}>{name} creators</span>

        <span>
          <span className={styles.categoryLinkViewers}>{liveStreams}</span> Live stream
          {liveStreams === 1 ? '' : 's'}
        </span>
      </div>
    </Link>
  );
}

CategoryLink.Loading = () => {
  return <LoadingSkeleton className={styles.loading} />;
};
