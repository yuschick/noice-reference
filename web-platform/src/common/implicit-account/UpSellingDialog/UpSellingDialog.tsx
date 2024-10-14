import {
  Anchor,
  ButtonLink,
  CurrencyIcon,
  Dialog,
  Image,
  LoadingSkeleton,
  WalletCurrencyId,
  useAnalytics,
} from '@noice-com/common-ui';
import {
  AnalyticsEventClientUpSellingDialogUpSellingDialogActionType,
  AnalyticsEventClientUpSellingDialogUpSellingDialogSource,
} from '@noice-com/schemas/analytics/analytics.pb';
import classNames from 'classnames';

import { isReactNativeWebView } from '../../../embeds/bridge';
import { useImplicitAccountUpSellingDialog } from '../context/ImplicitAccountUpSellingContext';
import { UpSellingDialogCategory, sourceMap } from '../types';

import styles from './UpSellingDialog.module.css';

import AvatarImage from '@assets/images/upselling-dialog-avatar.webp';
import CreatorImage from '@assets/images/upselling-dialog-creator.webp';
import GameAndCardsImage from '@assets/images/upselling-dialog-game-and-cards.webp';
import { useSignupTo } from '@common/route';

const imageBuCategory: Record<UpSellingDialogCategory, string> = {
  [UpSellingDialogCategory.Avatar]: AvatarImage,
  [UpSellingDialogCategory.Creator]: CreatorImage,
  [UpSellingDialogCategory.GameAndCards]: GameAndCardsImage,
};

const titleByCategory: Record<UpSellingDialogCategory, string> = {
  [UpSellingDialogCategory.Avatar]: 'Customize your avatar and stand out from the crowd',
  [UpSellingDialogCategory.Creator]: 'Support your favorite creators',
  [UpSellingDialogCategory.GameAndCards]: 'Are you ready to play the stream?',
};

const descriptionByCategory: Record<UpSellingDialogCategory, string> = {
  [UpSellingDialogCategory.Avatar]:
    'Showcase your personality as you emote and hype up the stream.',
  [UpSellingDialogCategory.Creator]:
    'The future of live-streaming awaits – Unlock exclusive Creator Cards, customize your avatar and find your community in chat.',
  [UpSellingDialogCategory.GameAndCards]:
    'Sign up now to unlock new packs, more powerful cards, and customizable avatars. Live-streaming never felt so good.',
};

export function UpSellingDialog() {
  const { dialogStore, dialogSource, dialogCategory } =
    useImplicitAccountUpSellingDialog();
  const { trackEvent } = useAnalytics();
  const signupTo = useSignupTo();
  const isEmbed = isReactNativeWebView();

  const source = dialogSource
    ? sourceMap[dialogSource]
    : AnalyticsEventClientUpSellingDialogUpSellingDialogSource.UP_SELLING_DIALOG_SOURCE_UNSPECIFIED;

  const onLogin = () => {
    trackEvent({
      clientUpSellingDialog: {
        action:
          AnalyticsEventClientUpSellingDialogUpSellingDialogActionType.UP_SELLING_DIALOG_ACTION_TYPE_LOGIN,
        source,
      },
    });
  };

  const onSignup = () => {
    trackEvent({
      clientUpSellingDialog: {
        action:
          AnalyticsEventClientUpSellingDialogUpSellingDialogActionType.UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP,
        source,
      },
    });
  };

  if (isEmbed) {
    return null;
  }

  return (
    <Dialog store={dialogStore}>
      <Dialog.Close />

      <Dialog.Content>
        {dialogCategory ? (
          <>
            <Image
              alt=""
              className={styles.upSellingImage}
              src={imageBuCategory[dialogCategory]}
            />

            <div className={styles.upSellingDialogContent}>
              <h1 className={styles.dialogTitle}>{titleByCategory[dialogCategory]}</h1>

              <p className={styles.dialogDescription}>
                {descriptionByCategory[dialogCategory]}
              </p>

              <div className={styles.dialogUpSellWrapper}>
                <div className={styles.creditWrapper}>
                  <CurrencyIcon type={WalletCurrencyId.HardCurrency} />

                  <p>
                    Get <strong>250</strong> Noice Credits
                  </p>
                </div>

                <div className={styles.price}>Free</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <LoadingSkeleton
              className={classNames(styles.upSellingImage, styles.loadingImage)}
            />

            <div className={styles.loadingContent}>
              <LoadingSkeleton
                count={3}
                height={64}
              />
            </div>
          </>
        )}
      </Dialog.Content>

      <Dialog.Actions>
        <div className={styles.footerContent}>
          <ButtonLink
            theme="dark"
            to={signupTo}
            onClick={onSignup}
          >
            Sign up to Noice!
          </ButtonLink>

          <span>
            Already have an account?{' '}
            <Anchor
              color="dark"
              href={signupTo}
              onClick={onLogin}
            >
              Log in
            </Anchor>{' '}
            instead.
          </span>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
