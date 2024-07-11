'use client'
import { useEffect, useState } from 'react';
import styles from './profile.module.css'
import Navbar from '../Components/Navbar';
import Image from 'next/image';
import { useAuth } from '../context/authContext';
import { useService } from '../context/serviceContext';
import { useRouter } from 'next/navigation';
import { useProvider } from '../context/providerContext';
import Cookies from 'js-cookie';
import AuthGuard from '../Components/AuthGuard';

const Profile = () => {
    const { logout, user, editUserData } = useAuth();
    const { activeService, cancelService, getHistory } = useService();
    const { getProvider } = useProvider();
    const [service, setService] = useState(null)
    const [history, setHistory] = useState(null)

    const router = useRouter();
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAdress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const auth = Cookies.get('token');
        if (!auth) {
            router.push('/LogIn');
        }
        else {
            try {
                if (activeService) {
                    const decodedService = JSON.parse(activeService);
                    setService(decodedService);
                } else {
                    setService(null);
                }
            } catch (error) {
                console.error('Error parsing service:', error);
                setService(null);
            }
            try {
                setHistory(getHistory(user.id))
            } catch (error) {
                console.error('Cant get history', error);
                setHistory(null)
            }
            setId(user.id);
            setName(user.name);
            setEmail(user.email);
            setAdress(user.address);
            setPhone(user.phone);
        }
    }, [router]);

    const handleLogout = () => {
        logout()
    }

    const providerContact = () => {
        //https://wa.me/573148735894
        const provider = getProvider(service.providerId)
        router.push(`https://wa.me/${provider.phone}`)
    }

    const editData = () => {
        editUserData(user.id)
    }

    const cancelActiveService = () => {
        cancelService(service.id)
    }

    return (
        <AuthGuard>
        <div className={styles.main}>
            <Navbar></Navbar>
            <div className={styles.topSection}>
                <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={'500'} height={'200'} />
                <h1 className={styles.title}>Mi perfil</h1>
            </div>
            <div className={styles.bottomSection}>
                <div className={styles.userDataContainer}>
                    <div className={styles.userData}>
                        <div className={styles.inputContainer}>
                            <p>Nombre completo</p>
                            <input type='text' className={styles.dataInput} placeholder={name}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <p>Correo electronico</p>
                            <input type='text' className={styles.dataInput} placeholder={email}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <p>Dirección</p>
                            <input type='text' className={styles.dataInput} placeholder={address}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <p>Telefono</p>
                            <input type='text' className={styles.dataInput} placeholder={phone}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <button className={styles.editData} onClick={editData} id='editData'>Modificar datos</button>

                        </div>
                        <div className={styles.inputContainer}>
                            <button className={styles.logOut} onClick={handleLogout} id='logOut'>Cerrar sesión</button>
                        </div>
                    </div>
                </div>
                <div className={styles.userServices}>
                    <div className={styles.activeService}>
                        <div className={styles.serviceTitle}>
                            <h2>Servicio activo</h2>
                            <button onClick={providerContact} className={styles.contactButton}>Contactar al proveedor</button>
                        </div>
                        <div className={styles.serviceIndex}>
                            <p className={styles.serviceText}>Titulo</p>
                            <p className={styles.serviceText}>Precio</p>
                            <p className={styles.serviceText}>Fecha de solicitadud</p>
                            <p className={styles.serviceText}>Fecha de realizacion</p>
                            <p className={styles.serviceText}></p>
                        </div>
                        {service ? (
                            <div className={styles.serviceInfo}>
                                <p className={styles.serviceInfoText}>{service.title}</p>
                                <p className={styles.serviceInfoText}>{service.price}</p>
                                <p className={styles.serviceInfoText}>{service.requestDate}</p>
                                <p className={styles.serviceInfoText}>{service.finishDate}</p>
                                <div className={styles.serviceInfoText}>
                                    <button onClick={cancelActiveService} className={styles.cancelButton}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <p>No hay servicio activo.</p>
                        )}
                    </div>
                    <div className={styles.serviceHistory}>
                        <div className={styles.serviceTitle}>
                            <h2>Historial de servicios</h2>
                        </div>
                        <div className={styles.serviceIndex}>
                            <p className={styles.serviceText}>Titulo</p>
                            <p className={styles.serviceText}>Precio</p>
                            <p className={styles.serviceText}>Fecha de solicitadud</p>
                            <p className={styles.serviceText}>Fecha de realizacion</p>
                            <p className={styles.serviceText}>Estado</p>
                        </div>
                        {history && history.length > 0 ? (
                            history.map((item, index) => (
                                <div key={index} className={styles.serviceInfo}>
                                    <p className={styles.serviceInfoText}>{item.title}</p>
                                    <p className={styles.serviceInfoText}>${item.price} COP</p>
                                    <p className={styles.serviceInfoText}>{item.requestDate}</p>
                                    <p className={styles.serviceInfoText}>{item.finishDate}</p>
                                    <div className={styles.serviceInfoText}>
                                        <div className={styles.serviceState}>{item.status}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay historial de servicios.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </AuthGuard>
    )
}

export default Profile;