/**
 * The TitleAnnouncer is essential for assistive technologies attempting to navigate single page applications (SPAs).
 * It is used to announce the current page title when the route changes and redirect the user's focus to the title.
 * This replicates more of the native behavior in browsers that is lost in SPAs.
 *
 * When using the TitleAnnouncer, place it at the very top of the DOM but still within the Router as it relies on the useLocation() hook.
 * If you're not using a screen reader or keyboard to navigate, you won't even notice this exists.
 */

import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { VisuallyHidden } from '../VisuallyHidden';

export function TitleAnnouncer() {
  const [title, setTitle] = useState<string>();
  const titleRef = useRef<HTMLParagraphElement>(null);

  const { pathname } = useLocation();

  const handleHelmetChange = ({ title }: { title: string }) => setTitle(title);

  useEffect(() => {
    if (!titleRef.current) {
      return;
    }

    titleRef.current.focus();
  }, [pathname]);

  return (
    <>
      <VisuallyHidden
        ref={titleRef}
        tabIndex={-1}
      >
        {title}
      </VisuallyHidden>

      <Helmet onChangeClientState={handleHelmetChange} />
    </>
  );
}
