import { useClient, useMountEffect } from '@noice-com/common-react-core';
import {
  Button,
  SignupMethod as SignupMethodForm,
  SignupContent,
  useSignupAnalytics,
  useSignup,
  ChannelLogo,
  FullscreenSpinner,
  Anchor,
  NoiceSupportLinks,
  LoadingSkeleton,
  useAuthentication,
} from '@noice-com/common-ui';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useEffect, useState } from 'react';

import { ClosedBetaWarning } from './ClosedBetaWarning/ClosedBetaWarning';
import styles from './SignupMethod.module.css';
import { UnsupportedBrowserWarning } from './UnsupportedBrowser/UnsupportedBrowser';

import { LiveBadge } from '@common/channel';
import { useEnvironmentCheck } from '@common/environment';
import { ChannelLiveStatus } from '@gen';

const getMostImportantWarning = (envChecks: ReturnType<typeof useEnvironmentCheck>) => {
  if (typeof envChecks.isSupportedBrowser !== 'boolean') {
    return (
      <LoadingSkeleton
        className={styles.warningLoading}
        height={50}
      />
    );
  }

  if (!envChecks.isSupportedBrowser) {
    return <UnsupportedBrowserWarning />;
  }

  return <ClosedBetaWarning />;
};

export function SignupMethod() {
  const [showEarlyAccessNote, setShowEarlyAccessNote] = useState(false);

  const envChecks = useEnvironmentCheck();
  const { sendAnalyticsStepEvent } = useSignupAnalytics();
  const { channel, isLoadingChannel } = useSignup();

  const { userId, hasRole } = useAuthentication();
  const client = useClient();

  const mostImportantWarning = getMostImportantWarning(envChecks);

  useMountEffect(() => {
    sendAnalyticsStepEvent(AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_METHOD);
  });

  useEffect(() => {
    const fullUser = hasRole('full_user');

    // Prevent token refresh if it is temporary user: they are converted to full user after email signup
    if (userId && !fullUser) {
      return;
    }

    if (fullUser) {
      window.location.pathname = '/';
    }
  }, [client, hasRole, userId]);

  if (isLoadingChannel) {
    return <FullscreenSpinner />;
  }

  if (showEarlyAccessNote) {
    return (
      <SignupContent>
        <SignupContent.Main>
          <SignupContent.SubWrapper>
            <SignupContent.Title>Welcome to Noice&apos;s open beta</SignupContent.Title>

            <SignupContent.Description>
              Get ready to dive into Noice. By participating, you&apos;ll be among the
              first to experience the game and help us shape its future.
            </SignupContent.Description>
          </SignupContent.SubWrapper>

          <SignupContent.TextSection>
            <h2 className={styles.earlyAccessNoteTitle}>What is open beta about?</h2>

            <p>
              You may encounter bugs, incomplete features, and changes as we continue to
              refine and expand the platform.
            </p>

            <p>
              Your feedback and patience are invaluable as we refine the experience. So
              please share your thoughts, suggestions, and report any issues you come
              across. Let&apos;s make this journey together.
            </p>
          </SignupContent.TextSection>
        </SignupContent.Main>

        <SignupContent.Actions>
          <Button
            theme="dark"
            onClick={() => setShowEarlyAccessNote(false)}
          >
            Go back
          </Button>
        </SignupContent.Actions>
      </SignupContent>
    );
  }

  return (
    <SignupContent>
      {mostImportantWarning && (
        <SignupContent.Header>{mostImportantWarning}</SignupContent.Header>
      )}

      <SignupContent.Main>
        {!!channel && (
          <div className={styles.channel}>
            <ChannelLogo
              channel={channel}
              size="lg"
            />

            <SignupContent.Title>Join {channel.name}</SignupContent.Title>

            {channel.liveStatus === ChannelLiveStatus.LiveStatusLive && <LiveBadge />}
          </div>
        )}

        <SignupContent.SubWrapper>
          {!channel && <SignupContent.Title>Play the stream</SignupContent.Title>}

          <SignupContent.Description>
            Create a profile to play and predict the stream, win rewards, and more.
          </SignupContent.Description>
        </SignupContent.SubWrapper>

        <SignupMethodForm />

        <p className={styles.closedBetaText}>
          We are in Open Beta.{' '}
          <button
            className={styles.closedBetaReadMoreButton}
            onClick={() => setShowEarlyAccessNote(true)}
          >
            Read more.
          </button>
        </p>
        <p className={styles.hcaptchaText}>
          This site is protected by{' '}
          <Anchor
            color="dark"
            href="https://www.hCaptcha.com"
          >
            hCaptcha
          </Anchor>{' '}
          and its use is governed by our{' '}
          <Anchor
            color="dark"
            href={NoiceSupportLinks.PrivacyPolicy}
          >
            Privacy Policy
          </Anchor>
          .
        </p>
      </SignupContent.Main>
    </SignupContent>
  );
}
