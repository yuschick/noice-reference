import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import styles from './NotFoundPage.module.css';

import { moduleWithPaths } from '@modules';

const modulesWithoutIndexPage = moduleWithPaths.filter(
  (module) => !module.pages.some((page) => page.id === 'index'),
);

export function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current module, ignoring modules that has index page
    const module = modulesWithoutIndexPage.find(
      (module) => `/${module.path}` === location.pathname,
    );

    // Do nothing if module is not in modules without index page list
    if (!module) {
      return;
    }

    // Get modules first page that is not contextual
    const nonContextualPage = module?.pages.find((page) => !page.id.startsWith(':'));

    // Navigate to that page if it exists
    if (nonContextualPage) {
      navigate(nonContextualPage.path, { replace: true });
      return;
    }
  }, [location, navigate]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Not found</h1>
    </div>
  );
}
