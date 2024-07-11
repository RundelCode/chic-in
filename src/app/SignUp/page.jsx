"use client";
import { useState } from 'react';
import styles from './signup.module.css';
import Image from 'next/image';
import logo from '../../../public/images/LogoChicIn.png';
import { useAuth } from '../context/authContext';

const SignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const { register } = useAuth();
    const [selectedRole, setSelectedRole] = useState('clients');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleRegister = (event) => {
        event.preventDefault();
        const form = event.target;
        if (password === passwordConfirmation) {
            if(selectedRole === "clients"){
                const user = {
                    name: name,
                    email: email,
                    password: password,
                    city: city,
                    address: address,
                    phone: phone
                }
                register(user, selectedRole)
            }
            else{
                const user = {
                    name: name,
                    email: email,
                    password: password,
                    city: city,
                    phone: phone,
                    categories: category
                }
                register(user, selectedRole)
            }
        }
        else {
            alert("Las contraseñas no coinciden")
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.formBox}>
                <div className={styles.logo}>
                    <Image src={logo} alt="Chic in logo" width={150} height={80} />
                </div>
                <h1>REGISTRATE</h1>

                <div className={styles.roleSwitch}>
                    <button
                        className={`${styles.roleButton} ${selectedRole === 'clients' ? styles.selected : ''}`}
                        onClick={() => setSelectedRole('clients')}>
                        Client
                    </button>
                    <button
                        className={`${styles.roleButton} ${selectedRole === 'providers' ? styles.selected : ''}`}
                        onClick={() => setSelectedRole('providers')}>
                        Provider
                    </button>
                </div>

                <form onSubmit={handleRegister}>
                    <div className={styles.inputBox}>
                        <h5>Nombre y apellido</h5>
                        <input onChange={(event) => setName(event.target.value)} type="text" placeholder="Nombre y apellido"
                            required />
                    </div>
                    <div className={styles.inputBox}>
                        <h5>Correo electrónico</h5>
                        <input onChange={(event) => setEmail(event.target.value)} type="email"
                            placeholder="Correo electrónico" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputBoxHalf1}>
                            <h5>Ciudad</h5>
                            <input onChange={(event) => setCity(event.target.value)} type="text" placeholder="ciudad"
                                required />
                        </div>
                        {selectedRole === 'clients' && (
                            <div className={styles.inputBoxHalf}>
                                <h5>Dirección</h5>
                                <input onChange={(event) => setAddress(event.target.value)} type="text" placeholder="Dirección" required />
                            </div>
                        )}
                        {selectedRole === 'providers' && (
                            <div className={styles.inputBoxHalf}>
                            <h5>Categoria</h5>
                            <select
                              className={styles.categorySelect}
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              required
                            >
                              <option value="">Selecciona una opción</option>
                              <option value="Lifting de pestañas">Lifting de pestañas</option>
                              <option value="Uñas">Uñas</option>
                            </select>
                          </div>
                        )}
                    </div>
                    <div className={styles.inputBox}>
                        <h5>Teléfono</h5>
                        <input onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="Teléfono"
                            required />
                    </div>
                    <div className={styles.inputBox}>
                        <h5>Contraseña</h5>
                        <div className={styles.passwordWrapper}>
                            <input
                                onChange={(event) => setPassword(event.target.value)}
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
                                onChange={(event) => setPasswordConfirmation(event.target.value)}
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
                        <p>¿Ya tienes una cuenta? <a href="/LogIn">Inicia sesión</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;