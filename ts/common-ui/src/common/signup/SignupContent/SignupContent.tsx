import { Children, isValidElement } from 'react';

import styles from './SignupContent.module.css';
import { SignupContentActions } from './SignupContentActions/SignupContentActions';
import { SignupContentDescription } from './SignupContentDescription/SignupContentDescription';
import { SignupContentHeader } from './SignupContentHeader/SignupContentHeader';
import { SignupContentMain } from './SignupContentMain/SignupContentMain';
import { SignupContentSubWrapper } from './SignupContentSubWrapper/SignupContentSubWrapper';
import { SignupContentTextSection } from './SignupContentTextSection/SignupContentTextSection';
import { SignupContentTitle } from './SignupContentTitle/SignupContentTitle';

import { WithChildren } from '@common-types';

export function SignupContent({ children }: WithChildren) {
  let Main, Header, Actions;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === SignupContentMain) {
      Main = child;
      return;
    }

    if (child.type === SignupContentHeader) {
      Header = child;
      return;
    }

    if (child.type === SignupContentActions) {
      Actions = child;
      return;
    }

    throw new Error(`Signup content: Invalid child type: ${child.type}`);
  });

  return (
    <article className={styles.signupContentWrapper}>
      {Header}
      <main>
        {Main}
        {Actions}
      </main>
    </article>
  );
}

SignupContent.Main = SignupContentMain;
SignupContent.Header = SignupContentHeader;
SignupContent.Actions = SignupContentActions;
SignupContent.TextSection = SignupContentTextSection;
SignupContent.Title = SignupContentTitle;
SignupContent.Description = SignupContentDescription;
SignupContent.SubWrapper = SignupContentSubWrapper;
