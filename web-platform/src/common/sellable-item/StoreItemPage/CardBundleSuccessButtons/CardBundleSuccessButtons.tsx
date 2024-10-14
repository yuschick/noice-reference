import { Button } from '@noice-com/common-ui';

import { isReactNativeWebView } from '../../../../embeds/bridge';

import styles from './CardBundleSuccessButtons.module.css';

interface Props {
  isAnimationFinished: boolean;
  isRevealFinished: boolean;
  onSkip(): void;
  onClose(): void;
}

export function CardBundleSuccessButtons({
  isAnimationFinished,
  isRevealFinished,
  onSkip,
  onClose,
}: Props) {
  const isEmbed = isReactNativeWebView();

  if (isEmbed && isRevealFinished) {
    return null;
  }

  if (isRevealFinished) {
    return (
      <div className={styles.wrapper}>
        <Button
          fit="content"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Button
        fit="content"
        level="secondary"
        onClick={onSkip}
      >
        {isAnimationFinished ? 'Reveal All' : 'Skip'}
      </Button>
    </div>
  );
}
