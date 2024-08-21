'use client';
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
import { format } from 'date-fns';

const Profile = () => {
    const { logout, user, loginToken } = useAuth();
    const { getServiceById, cancelService, getHistory, setActiveService, getActiveService } = useService();
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
            let activeService = {}
            const auth = Cookies.get('token');
            if (!auth) {
                router.push('/Login');
            } else {
                try {

                    const services = await getActiveService(user.id, loginToken);
                    for (let i = 0; i < services.length; i++) {
                        if (services[i].status === "Active" || services[i].status === "Pending") {
                            activeService = services[i];
                        }
                    }
                } catch (error) {
                    console.error('Error getting active service:', error);
                    setService(null);
                }
                try {
                    activeService = await getServiceById(activeService.id)
                    setService(activeService)
                } catch (err) {
                    console.error(err);
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
                    router.push("/Login");
                }
            }
        };

        fetchData();
    }, [router, user, loginToken, getActiveService, getHistory]);

    const handleLogout = () => {
        logout();
        console.log(service)
    };

    const providerContact = async () => {
        try {
            const provider = await getProvider(service.providerId);
            router.push(`https://wa.me/${provider.phone}`);
        } catch (error) {
            console.error('Error getting provider contact:', error);
        }
    };

    const cancelActiveService = () => {
        cancelService(service.id);
    };

    const formatDate = (date) => {
        return date ? format(new Date(date), 'MMM d, yyyy h:mm a') : '';
    };

    return (
        <AuthGuard>
            <TypeGuard2>
                <div className={styles.main}>
                    <Navbar />
                    <div className={styles.bottomSection}>
                        <div className={styles.userDataContainer}>

                            <div className={styles.userData}>
                                <h1>Mi Perfil</h1>
                                <div className={styles.inputContainer}>
                                    <p><strong>Nombre completo:</strong><br /> {name}</p>
                                </div>
                                <div className={styles.inputContainer}>
                                    <p><strong>Correo electronico: </strong><br /> {email}</p>
                                </div>
                                <div className={styles.inputContainer}>
                                    <p><strong>Dirección:</strong><br /> {address}</p>
                                </div>
                                <div className={styles.inputContainer}>
                                    <p><strong>Teléfono:</strong><br /> {phone}</p>
                                </div>
                                <div className={styles.inputContainer}>
                                    <button className={styles.logOut} onClick={handleLogout} id='logOut'>Cerrar sesión</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.userServices}>
                            <div className={styles.activeService}>
                                <div className={styles.serviceTitle}>
                                    <h2>Servicio</h2>
                                    <button onClick={providerContact} className={styles.contactButton}>Contactar al proveedor</button>
                                    <button onClick={cancelActiveService} className={styles.cancelButton}>Cancelar</button>
                                </div>
                                <div className={styles.serviceIndex}>
                                    <p className={styles.serviceText} style={{ marginRight: "10px" }}>Título</p>
                                    <p className={styles.serviceText} style={{ width: "10%" }}>Precio</p>
                                    <p className={styles.serviceText}>Fecha de solicitud</p>
                                    <p className={styles.serviceText}>Fecha de realización</p>
                                    <p className={styles.serviceText}>Estado</p>
                                </div>
                                {service ? (
                                    <div className={styles.serviceInfo}>
                                        <div className={styles.servideInfoInnerContainer}>
                                            <p className={styles.serviceInfoText} style={{ marginRight: "10px" }}><strong className={styles.phoneIndex}>Titulo: </strong>{service.title}</p>
                                            <p className={styles.serviceInfoText} style={{ width: "10%" }}><strong className={styles.phoneIndex}>Precio: </strong>${service.price}</p>
                                            <p className={styles.serviceInfoText}><strong className={styles.phoneIndex}>Fecha de solicitud: </strong>{formatDate(service.requestDate)}</p>
                                            <p className={styles.serviceInfoText}><strong className={styles.phoneIndex}>Fecha de realización: </strong>{formatDate(service.finishDate)}</p>
                                            <p className={styles.serviceInfoText}><strong className={styles.phoneIndex}>Estado: </strong>{service.status == "Pending" ? (<div>Pendiente</div>) : (<div>Activo</div>)}</p>
                                        </div>
                                        <div className={styles.microServices}>
                                            <strong>Microservicios: </strong>
                                            {service.Microservices.map(microService=>{
                                                return(
                                                    <p>{`${microService.serviceType} ${microService.technique},`}</p>
                                                )
                                            })}
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
                                    <p className={styles.serviceText} style={{ marginRight: "10px" }}>Título</p>
                                    <p className={styles.serviceText}>Precio</p>
                                    <p className={styles.serviceText}>Fecha de solicitud</p>
                                    <p className={styles.serviceText}>Fecha de realización</p>
                                    <p className={styles.serviceText}>Estado</p>
                                </div>
                                {history.length > 0 ? (
                                    history.map((item, index) => (
                                        <div key={index} className={styles.serviceInfo2}>
                                            <p className={styles.serviceInfoText} style={{ marginRight: "10px" }}><strong className={styles.phoneIndex}>Titulo: </strong>{item.title}</p>
                                            <p className={styles.serviceInfoText}><strong className={styles.phoneIndex}>Precio: </strong> ${item.price} COP</p>
                                            <p className={styles.serviceInfoText}><strong className={styles.phoneIndex}>Fecha de solicitud: </strong>{formatDate(item.requestDate)}</p>
                                            <p className={styles.serviceInfoText}><strong className={styles.phoneIndex}>Fecha de realización: </strong>{formatDate(item.finishDate)}</p>
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
