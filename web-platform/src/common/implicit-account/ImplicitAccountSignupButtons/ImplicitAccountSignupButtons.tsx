import { ButtonLink, useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType } from '@noice-com/schemas/analytics/analytics.pb';

import styles from './ImplicitAccountSignupButtons.module.css';

import { useSignupTo } from '@common/route';

interface Props {
  section: string;
}

export function ImplicitAccountSignupButtons({ section }: Props) {
  const { trackEvent } = useAnalytics();
  const signupTo = useSignupTo();

  const onClick = (button: 'login' | 'signup') => {
    trackEvent({
      clientSignupButtonClick: {
        action:
          button === 'signup'
            ? AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType.ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP
            : AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType.ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN,
        section: `${section}-signup-buttons`,
      },
    });
  };

  return (
    <div className={styles.signupButtons}>
      <ButtonLink
        level="secondary"
        size="sm"
        to={signupTo}
        onClick={() => onClick('login')}
      >
        Log in
      </ButtonLink>

      <ButtonLink
        size="sm"
        to={signupTo}
        onClick={() => onClick('signup')}
      >
        Sign up
      </ButtonLink>
    </div>
  );
}
