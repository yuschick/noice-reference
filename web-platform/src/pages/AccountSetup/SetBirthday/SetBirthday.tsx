import { gql } from '@apollo/client';
import {
  Anchor,
  Button,
  NoiceSupportLinks,
  SignupBirthday,
  SignupContent,
  isSignupDisabledByBirthDate,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { FormEvent, useEffect, useId, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router';

import styles from './SetBirthday.module.css';

import { useListenAppLocalStorageValue } from '@common/localstorage';
import { ACCOUNT_SETUP_AVATAR_PATH } from '@common/route';
import { useSetBirthdayMutation, useSetBirthdayProfileQuery } from '@gen';
import { NoAccessPage } from '@pages/common/NoAccessPage';

gql`
  query SetBirthdayProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        birthday {
          day
          month
          year
        }
      }
    }
  }

  mutation SetBirthday($day: Int!, $month: Int!, $year: Int!) {
    setBirthday(birthday: { day: $day, month: $month, year: $year }) {
      emptyTypeWorkaround
    }
  }
`;

type BirhtdayError = 'too-young' | 'api-error';

export function SetBirthday() {
  const [error, setError] = useState<Nullable<BirhtdayError>>(null);
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();
  const location = useLocation();
  const navigate = useNavigate();
  const formId = useId();

  const { userId } = useAuthenticatedUser();
  const [setupDisabledUntilDate, setSetupDisabledUntilDate] =
    useListenAppLocalStorageValue('account.setup.disabled');

  useEffect(() => {
    if (!setupDisabledUntilDate) {
      return;
    }

    // If setup is disabled, show too young error
    if (setupDisabledUntilDate > Date.now()) {
      setError('too-young');
      return;
    }

    // If setup is not disabled anymore, reset the value
    setSetupDisabledUntilDate(0);
  }, [setSetupDisabledUntilDate, setupDisabledUntilDate]);

  const { loading } = useSetBirthdayProfileQuery({
    variables: {
      userId,
    },
    onCompleted(data) {
      // If user has birthday, redirect avatar setup
      if (data.profile?.account?.birthday) {
        navigate(ACCOUNT_SETUP_AVATAR_PATH, {
          state: location.state,
        });
      }
    },
  });

  const [setBirthday] = useSetBirthdayMutation({
    onCompleted() {
      // When completed, redirect avatar setup
      navigate(ACCOUNT_SETUP_AVATAR_PATH, {
        state: location.state,
      });
    },
    onError() {
      setError('api-error');
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!day || !month || !year) {
      return;
    }

    if (isSignupDisabledByBirthDate(day, month, year)) {
      setError('too-young');

      // Disable birhtday setup for 1 day if user is giving date that is too young
      const currentDate = new Date();
      const dayInMs = 1000 * 60 * 60 * 24;
      setSetupDisabledUntilDate(currentDate.getTime() + dayInMs);

      return;
    }

    setBirthday({
      variables: {
        day,
        month,
        year,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Complete your Noice account</title>
      </Helmet>

      <NoAccessPage
        loading={loading}
        title="Complete your account"
        withBackground
      >
        <SignupContent>
          <SignupContent.Main>
            {error ? (
              <>
                <SignupContent.Title>Something went wrong</SignupContent.Title>

                {error === 'api-error' && (
                  <>
                    <SignupContent.Description>
                      We were unable to perform the action due a technical issue on our
                      end. Please try again and if the issue persists contact support{' '}
                      <Anchor href={`mailto:${NoiceSupportLinks.SupportEmail}`}>
                        {NoiceSupportLinks.SupportEmail}
                      </Anchor>
                      .
                    </SignupContent.Description>

                    <Button
                      theme="dark"
                      onClick={() => setError(null)}
                    >
                      Try again
                    </Button>
                  </>
                )}

                {error === 'too-young' && (
                  <SignupContent.Description>
                    There was an issue while trying to create your account. Please contact{' '}
                    <Anchor href={`mailto:${NoiceSupportLinks.SupportEmail}`}>
                      {NoiceSupportLinks.SupportEmail}
                    </Anchor>
                    .
                  </SignupContent.Description>
                )}
              </>
            ) : (
              <form
                className={styles.form}
                id={formId}
                onSubmit={onSubmit}
              >
                <SignupContent.SubWrapper>
                  <SignupContent.Title>Complete your account</SignupContent.Title>
                </SignupContent.SubWrapper>

                <SignupBirthday
                  onDayChange={setDay}
                  onMonthChange={setMonth}
                  onYearChange={setYear}
                />
              </form>
            )}
          </SignupContent.Main>

          <SignupContent.Actions>
            <Button
              form={formId}
              level="primary"
              theme="dark"
              type="submit"
            >
              Continue
            </Button>
          </SignupContent.Actions>
        </SignupContent>
      </NoAccessPage>
    </>
  );
}
