// src/components/AuthGuard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './TypeGuard.home.module.css';

const TypeGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = Cookies.get('tokenType');
    if (auth === 'providers') {
      router.push('/ProviderList');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className={styles.loading}>
      Loading...
        <div className={styles.loadingSpinner}>
            
        </div>
    </div>;
  }

  return children;
};

export default TypeGuard;
