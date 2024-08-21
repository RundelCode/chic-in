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
    return <div className={styles.loadingScreen}>
      <h2>CARGANDO...</h2>
      <div className={styles.loader}>

      </div>
    </div>;
  }

  return children;
};

export default AuthGuard;
