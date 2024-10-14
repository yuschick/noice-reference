import { Image } from '@noice-com/common-ui';
import { ImgHTMLAttributes, SourceHTMLAttributes } from 'react';

import styles from './PageBackgroundImage.module.css';

interface Props extends Pick<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  sources?: SourceHTMLAttributes<HTMLSourceElement>[];
}

export function PageBackgroundImage({ sources, src }: Props) {
  return (
    <div className={styles.pageBackgroundImageWrapper}>
      <Image
        alt=""
        aria-hidden="true"
        className={styles.pageBackgroundImage}
        sizes="88vw"
        sources={sources}
        src={src}
      />
    </div>
  );
}
