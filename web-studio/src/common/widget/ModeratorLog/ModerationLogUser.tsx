import { gql } from '@apollo/client';

import { ModerationUser } from '@common/profile';
import { ModerationLogUserFragment } from '@gen';

interface Props {
  isModerator?: boolean;
  profile: ModerationLogUserFragment;
}

export function ModerationLogUser(props: Props) {
  return <ModerationUser {...props} />;
}

ModerationLogUser.fragments = {
  entry: gql`
    fragment ModerationLogUser on ProfileProfile {
      ...ModerationUser
    }
  `,
};
