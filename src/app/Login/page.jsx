'use client'
import styles from './login.module.css';
import Image from 'next/image';
import { useAuth } from '../context/authContext';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState('clients');
    const [error, setError] = useState(false);
    const [charging, setCharging] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(false);
        setCharging(true);
        const form = event.target;
        const email = form.emailInput.value;
        const password = form.passwordInput.value;
        const user = {
            email: email,
            password: password
        };

        try {
            const response = await login(user, selectedRole);
            if (response.success) {
                router.push('/Profile');
            }
        } catch (err) {
            setCharging(false);
            setError(true);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.formBox}>
                <div className={styles.logo}>
                    <Image src="/favicon.ico" alt="Chic in logo" width={150} height={80} />
                </div>
                <h1>Inicia sesión</h1>
                <div className={styles.roleSwitch}>
                    <button
                        className={`${styles.roleButton} ${selectedRole === 'clients' ? styles.selected : ''}`}
                        onClick={() => setSelectedRole('clients')}>
                        Cliente
                    </button>
                    <button
                        className={`${styles.roleButton} ${selectedRole === 'providers' ? styles.selected : ''}`}
                        onClick={() => setSelectedRole('providers')}>
                        Proveedor
                    </button>
                </div>
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
                    {error && <p className={styles.error}>Error al iniciar sesión. Por favor, inténtelo de nuevo.</p>}
                    {charging && <p className={styles.error}>Cargando...</p>}
                    <div className={styles.registerLink}>
                        <p>¿Aún no tienes una cuenta? <Link href="/SignUp">Regístrate</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
