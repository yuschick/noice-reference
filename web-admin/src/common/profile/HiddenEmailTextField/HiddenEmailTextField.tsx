import { gql } from '@apollo/client';
import { useState } from 'react';

import { TextField } from '@common/input';
import { HiddenEmailTextFieldProfileFragment } from '@gen';

gql`
  fragment HiddenEmailTextFieldProfile on ProfileProfile {
    account {
      email
    }
  }
`;

interface Props {
  profile: HiddenEmailTextFieldProfileFragment;
}

export function HiddenEmailTextField({ profile }: Props) {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <TextField
      label="Email"
      value={showEmail ? profile.account?.email ?? '' : 'Click to see'}
      readOnly
      onBlur={() => setShowEmail(false)}
      onClick={() => setShowEmail(true)}
      onFocus={() => setShowEmail(true)}
    />
  );
}
