import { To, useLocation } from 'react-router';

import { Routes } from '../types';

export function useSignupTo(): To {
  const location = useLocation();

  return {
    pathname: Routes.Signup,
    search: `from=${location.pathname}${encodeURIComponent(location.search)}`,
  };
}
