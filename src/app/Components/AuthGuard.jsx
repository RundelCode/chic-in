// src/components/AuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './AuthGuard.module.css';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = Cookies.get('token');
    if (!auth) {
      router.push('/Login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className={styles.loading}>
        <div className={styles.loadingSpinner}>
            Loading...
        </div>
    </div>;
  }

  return children;
};

export default AuthGuard;
