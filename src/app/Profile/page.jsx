'use client'
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import Navbar from '../Components/Navbar';
import Image from 'next/image';
import { useAuth } from '../context/authContext';
import { useService } from '../context/serviceContext';
import { useRouter } from 'next/navigation';
import { useProvider } from '../context/providerContext';
import Cookies from 'js-cookie';
import AuthGuard from '../Components/AuthGuard';
import TypeGuard2 from '../Components/TypeGuard2';

const Profile = () => {
    const { logout, user, editUserData, loginToken } = useAuth();
    const { activeService, cancelService, getHistory, setActiveService, getActiveService } = useService();
    const { getProvider } = useProvider();
    const [service, setService] = useState(null);
    const [history, setHistory] = useState([]);

    const router = useRouter();
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const auth = Cookies.get('token');
            if (!auth) {
                router.push('/LogIn');
            } else {
                try {
                    const services = await getActiveService(user.id, loginToken);
                    for (let i = 0; i < services.length; i++) {
                        if (services[i].status === "Active") {
                            setService(services[i]);
                        }
                    }

                } catch (error) {
                    console.error('Error getting active service:', error);
                    setService(null);
                }

                try {
                    const historyServices = await getHistory(user.id, loginToken);
                    const list = []
                    for (let i = 0; i < historyServices.length; i++) {
                        if (historyServices[i].status !== "Active") {
                            list.push(historyServices[i])
                        }
                    }
                    setHistory(list);
                } catch (error) {
                    console.error('Cant get history:', error);
                    setHistory([]);
                }

                if (user) {
                    setId(user.id);
                    setName(user.name);
                    setEmail(user.email);
                    setAddress(user.address);
                    setPhone(user.phone);
                } else {
                    router.push("/LogIn");
                }
            }
        };

        fetchData();
    }, [router, user, loginToken, getActiveService, getHistory]);

    const handleLogout = () => {
        logout();
    };

    const providerContact = async () => {
        try {
            const provider = await getProvider(service.providerId);
            router.push(`https://wa.me/${provider.phone}`);
        } catch (error) {
            console.error('Error getting provider contact:', error);
        }
    };

    const editData = () => {
        const updatedUser = {
            ...user,
            name,
            email,
            address,
            phone
        };
        // editUserData(updatedUser, loginToken);
    };

    const cancelActiveService = () => {
        cancelService(service.id);
    };

    return (
        <AuthGuard>
            <TypeGuard2>
                <div className={styles.main}>
                    <Navbar />
                    <div className={styles.topSection}>
                        <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={500} height={200} />
                        <h1 className={styles.title}>Mi perfil</h1>
                    </div>
                    <div className={styles.bottomSection}>
                        <div className={styles.userDataContainer}>
                            <div className={styles.userData}>
                                <div className={styles.inputContainer}>
                                    <p>Nombre completo</p>
                                    <input onChange={(e) => setName(e.target.value)} type='text' className={styles.dataInput} placeholder={name} />
                                </div>
                                <div className={styles.inputContainer}>
                                    <p>Correo electronico</p>
                                    <input onChange={(e) => setEmail(e.target.value)} type='text' className={styles.dataInput} placeholder={email} />
                                </div>
                                <div className={styles.inputContainer}>
                                    <p>Dirección</p>
                                    <input onChange={(e) => setAddress(e.target.value)} type='text' className={styles.dataInput} placeholder={address} />
                                </div>
                                <div className={styles.inputContainer}>
                                    <p>Teléfono</p>
                                    <input onChange={(e) => setPhone(e.target.value)} type='text' className={styles.dataInput} placeholder={phone} />
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
                                    <p className={styles.serviceText}>Título</p>
                                    <p className={styles.serviceText}>Precio</p>
                                    <p className={styles.serviceText}>Fecha de solicitud</p>
                                    <p className={styles.serviceText}>Fecha de realización</p>
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
                                    <p className={styles.serviceText}>Título</p>
                                    <p className={styles.serviceText}>Precio</p>
                                    <p className={styles.serviceText}>Fecha de solicitud</p>
                                    <p className={styles.serviceText}>Fecha de realización</p>
                                    <p className={styles.serviceText}>Estado</p>
                                </div>
                                {history.length > 0 ? (
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
            </TypeGuard2>
        </AuthGuard>
    );
}

export default Profile;
