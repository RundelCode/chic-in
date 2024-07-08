"use client";

import { useState } from 'react';
import styles from './signup.module.css';
import Image from 'next/image';
import logo from '../../../public/images/LogoChicIn.png';

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formBox}>
        <div className={styles.logo}>
          <Image src={logo} alt="Chic in logo" width={150} height={80} />
        </div>
        <h1>REGISTRATE</h1>
        <form>
          <div className={styles.inputBox}>
            <h5>Nombre y apellido</h5>
            <input type="text" placeholder="Nombre y apellido" required />
          </div>
          <div className={styles.inputBox}>
            <h5>Correo electrónico</h5>
            <input type="email" placeholder="Correo electrónico" required />
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.inputBoxHalf1}>
              <h5>Ciudad</h5>
              <select id="serviceType" className={styles.selectBox}>
                <option value={''}>Ciudad</option>
                <option value={'Pereira'}>PEREIRA</option>
                <option value={'Manizales'}>MANIZALES</option>
              </select>
            </div>
            <div className={styles.inputBoxHalf}>
              <h5>Dirección</h5>
              <input type="text" placeholder="Dirección" required />
            </div>
          </div>
          <div className={styles.inputBox}>
            <h5>Teléfono</h5>
            <input type="tel" placeholder="Teléfono" required />
          </div>
          <div className={styles.inputBox}>
            <h5>Contraseña</h5>
            <div className={styles.passwordWrapper}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? '' : ''}
              </button>
            </div>
          </div>
          <div className={styles.inputBox}>
            <h5>Confirma la contraseña</h5>
            <div className={styles.passwordWrapper}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirma la contraseña"
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? '' : ''}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.button}>Registrarse</button>
          <div className={styles.registerLink}>
            <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
