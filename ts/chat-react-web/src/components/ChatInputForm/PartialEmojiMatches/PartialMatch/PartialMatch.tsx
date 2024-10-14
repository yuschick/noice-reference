import styles from './PartialMatch.module.css';

interface Props {
  text: string;
  partialMatch: string;
}

export function PartialMatch({ text, partialMatch }: Props) {
  const matchRegExp = new RegExp(`(${partialMatch})`.replace(/:/g, ''), 'gi');
  const textParts = text.split(matchRegExp);

  function renderTextParts() {
    return textParts
      .filter((part) => part)
      .map((part, i) =>
        matchRegExp.test(part.replace(/:/g, '')) ? (
          <mark
            className={styles.partialMatch}
            key={i}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      );
  }

  return <span>{renderTextParts()}</span>;
}
