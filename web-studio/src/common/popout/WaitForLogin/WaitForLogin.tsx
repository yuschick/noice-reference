import { useSearchParams } from 'react-router-dom';

import { useNavigateOnLogin } from '../../navigation/hooks/useNavigateOnLogin.hook';

import styles from './WaitForLogin.module.css';

export function WaitForLogin() {
  const [searchParams] = useSearchParams();

  useNavigateOnLogin({ to: searchParams.get('from') });

  return <div className={styles.waitForAuthenticationContainer}>Login to Noice</div>;
}
