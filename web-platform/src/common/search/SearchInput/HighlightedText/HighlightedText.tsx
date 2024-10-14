import { CommonUtils } from '@noice-com/common-ui';

import styles from './HighlightedText.module.css';

interface Props {
  text: string;
  query: string;
}

export function HighlightedText({ text, query }: Props) {
  const queryPosition = text
    .toLowerCase()
    .search(CommonUtils.escapeRegex(query).toLowerCase());

  if (queryPosition < 0) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {text.slice(0, queryPosition)}
      <mark className={styles.highlight}>
        {text.slice(queryPosition, queryPosition + query.length)}
      </mark>
      {text.slice(queryPosition + query.length)}
    </span>
  );
}
