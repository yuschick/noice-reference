import { Button, SignupContent, NoiceSupportLinks, Anchor } from '@noice-com/common-ui';

import styles from './TermFormError.module.css';

interface Props {
  onError(): void;
}

export function TermsFormError({ onError }: Props) {
  return (
    <SignupContent>
      <SignupContent.Main>
        <div className={styles.wrapper}>
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
              onClick={onError}
            >
              Try again
            </Button>
          </div>
        </div>
      </SignupContent.Main>
    </SignupContent>
  );
}
