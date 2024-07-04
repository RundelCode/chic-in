import styles from './login.module.css';
import Image from 'next/image';

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <div className={styles.logo}>
          <Image src="/favicon.ico" alt="Chic in logo" width={150} height={80} />
        </div>
        <h1>Inicia sesión</h1>
        <form>
          <div className={styles.inputBox}>
            <h5>Correo Electrónico</h5>
            <input type="text" placeholder="Correo electrónico" required />
          </div>
          <div className={styles.inputBox}>
            <h5>Contraseña</h5>
            <input type="password" placeholder="Contraseña" required />
          </div>
          <button type="submit" className={styles.button}>Iniciar sesión</button>
          <div className={styles.registerLink}>
            <p>¿Aun no tienes una cuenta? <a href="/register">Regístrate</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
