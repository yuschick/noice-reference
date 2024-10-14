import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { ProfileImage } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { generatePath } from 'react-router';

import styles from './UserDrawer.module.css';

import { ButtonLink } from '@common/button';
import { useDrawer } from '@common/drawer';
import { TextField } from '@common/input';
import { HiddenEmailTextField } from '@common/profile';
import { useUserDrawerQuery } from '@gen';

gql`
  query UserDrawer($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      lastSeen
      account {
        acceptedTerms {
          revision
          name
          signature
        }
        pendingAgreements {
          name
          revision
        }
      }
      ...ProfileImageProfile
      ...HiddenEmailTextFieldProfile
    }
  }
`;

export function UserDrawer() {
  const { activeId } = useDrawer();

  const { data, loading } = useUserDrawerQuery({
    ...variablesOrSkip({ userId: activeId }),
  });

  // @todo pretty loading
  if (loading) {
    return null;
  }

  if (!data?.profile) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <ProfileImage
        profile={data.profile}
        size="lg"
      />

      <TextField
        defaultValue={data.profile.userId}
        label="User id"
        readOnly
      />

      <TextField
        defaultValue={data.profile.userTag}
        label="Username"
        readOnly
      />

      <HiddenEmailTextField profile={data.profile} />

      <TextField
        defaultValue={
          data.profile.lastSeen
            ? DateAndTimeUtils.getShortDate(data.profile.lastSeen)
            : ''
        }
        label="Last seen"
        readOnly
      />

      {data.profile.account?.acceptedTerms?.map(
        ({ name, revision, signature }, index) => (
          <fieldset key={index}>
            <legend>Accepted term</legend>

            <TextField
              defaultValue={name}
              label="Name"
              readOnly
            />

            <TextField
              defaultValue={revision}
              label="Revision"
              readOnly
            />

            <TextField
              defaultValue={signature}
              label="Signature"
              readOnly
            />
          </fieldset>
        ),
      )}

      {data.profile.account?.pendingAgreements?.map(({ name, revision }, index) => (
        <fieldset key={index}>
          <legend>Pending agreement</legend>

          <TextField
            defaultValue={name}
            label="Name"
            readOnly
          />

          <TextField
            defaultValue={revision}
            label="Revision"
            readOnly
          />
        </fieldset>
      ))}

      <div>
        <ButtonLink
          text="Open profile"
          to={generatePath('/users/:userId', { userId: data.profile.userId })}
        />
      </div>
    </div>
  );
}
