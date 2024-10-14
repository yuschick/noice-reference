import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient, useMountEffect } from '@noice-com/common-react-core';
import {
  Button,
  LoadingSpinner,
  ProfileImage,
  SignupContent,
  useAuthentication,
  NoiceSupportLinks,
  Anchor,
} from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { getOAuthTitle } from '../../utils';

import styles from './Authorization.module.css';
import { NightbotAuthorization } from './NightbotAuthorization/NightbotAuthorization';

import { OAuthRoutes, Routes } from '@common/route';
import { useAddOAuthConsentMutation, useOAuthProfileQuery } from '@gen';

const { logError } = makeLoggers('Oauth authorization');

gql`
  query OAuthProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      ...ProfileImageProfile
    }
  }

  mutation AddOAuthConsent($clientId: ID!, $userId: ID!, $scopes: [String!]) {
    addOAuth2Consent(clientId: $clientId, userId: $userId, scopes: $scopes) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  clientId: string;
}

export function Authorization({ clientId }: Props) {
  const [sessionIsChecked, setSessionIsChecked] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);

  const { userId, initialized } = useAuthentication();
  const client = useClient();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useMountEffect(() => {
    const checkSession = async () => {
      try {
        await client.refreshAccessToken();
        setSessionIsChecked(true);
      } catch (error) {
        navigate(`${Routes.OAuth}/${OAuthRoutes.Login}?${searchParams.toString()}`, {
          replace: true,
        });
      }
    };

    checkSession();
  });

  const { data, loading } = useOAuthProfileQuery({
    ...variablesOrSkip({ userId }),
  });

  const profile = data?.profile;

  const [addConsent] = useAddOAuthConsentMutation({
    errorPolicy: 'all',
    onCompleted() {
      window.location.href = `${
        NOICE.AUTH_PATH
      }/v4/oauth/authorization?${searchParams.toString()}`;
    },
    onError() {
      setIsAuthorizing(false);
      setShowErrorState(true);
    },
  });

  const onAuthorize = () => {
    setIsAuthorizing(true);

    if (!userId) {
      logError('User id is missing');
      return;
    }

    addConsent({
      variables: {
        clientId,
        scopes: searchParams.get('scope')?.split(' ') ?? [],
        userId,
      },
    });
  };

  if (!sessionIsChecked || !initialized || loading) {
    return <LoadingSpinner />;
  }

  if (!userId || !profile) {
    return (
      <Navigate
        to={`${Routes.OAuth}/${OAuthRoutes.Login}?${searchParams.toString()}`}
        replace
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Authorize</title>
      </Helmet>

      <SignupContent>
        <SignupContent.Main>
          {showErrorState ? (
            <div className={styles.errorWrapper}>
              <SignupContent.SubWrapper>
                <SignupContent.Title>Something went wrong</SignupContent.Title>

                <SignupContent.Description>
                  We were unable to perform the action due a technical issue on our end.
                  Please try again and if the issue persists contact support{' '}
                  <Anchor href={`mailto:${NoiceSupportLinks.SupportEmail}`}>
                    {NoiceSupportLinks.SupportEmail}
                  </Anchor>
                  .
                </SignupContent.Description>
              </SignupContent.SubWrapper>
              <div>
                <Button
                  theme="dark"
                  onClick={() => setShowErrorState(false)}
                >
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.titleWrapper}>
                <h1 className={styles.title}>
                  <span className={styles.clientName}>{getOAuthTitle(clientId)}</span>{' '}
                  wants to access your account
                </h1>

                <div className={styles.profileWrapper}>
                  <ProfileImage profile={profile} />
                  <span>{profile.userTag}</span>
                </div>
              </div>

              <SignupContent.TextSection disableMaxBlockWidth>
                <NightbotAuthorization />
              </SignupContent.TextSection>

              <Button
                isLoading={isAuthorizing}
                theme="dark"
                onClick={onAuthorize}
              >
                Authorize
              </Button>
            </>
          )}
        </SignupContent.Main>
      </SignupContent>
    </>
  );
}
