'use client'
import styles from './login.module.css';
import Image from 'next/image';
import { useAuth } from '../context/authContext';
import Link from 'next/link';

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.emailInput.value;
    const password = form.passwordInput.value;
    login(email, password);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <div className={styles.logo}>
          <Image src="/favicon.ico" alt="Chic in logo" width={150} height={80} />
        </div>
        <h1>Inicia sesión</h1>
        <form id='loginForm' onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <h5>Correo Electrónico</h5>
            <input id='emailInput' name='emailInput' type="text" placeholder="Correo electrónico" required />
          </div>
          <div className={styles.inputBox}>
            <h5>Contraseña</h5>
            <input id='passwordInput' name='passwordInput' type="password" placeholder="Contraseña" required />
          </div>
          <button type="submit" className={styles.button}>Iniciar sesión</button>
          <div className={styles.registerLink}>
            <p>¿Aún no tienes una cuenta? <Link href="/SignUp">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
