import { SignupContent } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getOAuthTitle } from '../../utils';

import { OAuthRoutes, Routes } from '@common/route';

interface Props {
  clientId: string;
}

export function RequireLogin({ clientId }: Props) {
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      setHasError(true);
      return;
    }

    // If there is no error, redirect to signup page, pointing to the authorization page
    const fromRoute = `${Routes.OAuth}/${OAuthRoutes.Authorization}?${encodeURIComponent(
      searchParams.toString(),
    )}`;

    navigate(`${Routes.Signup}?from=${fromRoute}`, { replace: true });
  }, [error, navigate, searchParams]);

  return (
    <>
      <Helmet>
        <title>{hasError ? 'Something went wrong' : 'Login Required'}</title>
      </Helmet>

      <SignupContent>
        <SignupContent.Main>
          {hasError ? (
            <>
              <SignupContent.Title>Something went wrong</SignupContent.Title>

              <SignupContent.Description>
                An error occurred during authorization to {getOAuthTitle(clientId)}:<br />
                {error?.replaceAll('_', ' ') ?? 'Unknown error'}
              </SignupContent.Description>
            </>
          ) : (
            <>
              <SignupContent.Title>Login required</SignupContent.Title>

              <SignupContent.Description>
                You have to login before authenticating {getOAuthTitle(clientId)}
              </SignupContent.Description>

              <SignupContent.Description>
                Redirecting to login...
              </SignupContent.Description>
            </>
          )}
        </SignupContent.Main>
      </SignupContent>
    </>
  );
}
