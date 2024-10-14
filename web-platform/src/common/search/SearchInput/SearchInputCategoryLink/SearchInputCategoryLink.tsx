import { gql } from '@apollo/client';
import { Image } from '@noice-com/common-ui';
import { Link } from 'react-router-dom';

import { HighlightedText } from '../HighlightedText';

import styles from './SearchInputCategoryLink.module.css';

import CategoryImagePlaceHolder from '@assets/images/category-placeholder.webp';
import { SearchInputCategoryLinkGameFragment } from '@gen';

interface Props {
  category: SearchInputCategoryLinkGameFragment;
  query: string;
  className?: string;
  link: string;
  onClick?: () => void;
}

export function SearchInputCategoryLink({
  category,
  className,
  query,
  link,
  onClick,
}: Props) {
  const { name, coverImageUrl } = category;

  return (
    <Link
      className={className}
      tabIndex={-1}
      to={link}
      onClick={onClick}
    >
      <Image
        alt={name}
        className={styles.categoryLinkImage}
        fit="cover"
        height={40}
        src={coverImageUrl ? coverImageUrl : CategoryImagePlaceHolder}
        width={71}
      />

      <div className={styles.details}>
        <HighlightedText
          query={query}
          text={name}
        />
      </div>
    </Link>
  );
}

SearchInputCategoryLink.fragments = {
  entry: gql`
    fragment SearchInputCategoryLinkGame on GameGame {
      id
      name
      coverImageUrl
    }
  `,
};
