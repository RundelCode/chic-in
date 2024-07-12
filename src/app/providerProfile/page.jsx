'use client'
import { useEffect, useState } from 'react';
import styles from './providerProfile.module.css';
import Navbar from '../Components/Navbar';
import Image from 'next/image';
import { useAuth } from '../context/authContext';
import { useService } from '../context/serviceContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import AuthGuard from '../Components/AuthGuard';
import CalendarComponent from '../Components/calendar';

const ProviderProfile = () => {
    const [activeService, setActiveService] = useState(null);
    const [history, setHistory] = useState([]);
    const [client, setClient] = useState(null);
    const [provider, setProvider] = useState(null);
    const router = useRouter();
    const [calendar, setCalendarVisible] = useState(false);

    const { user, logout, loginToken, getClient } = useAuth();
    const { getActiveService, getHistory, markAsFinished } = useService();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/LogIn");
            return;
        }
        setProvider(JSON.parse(token));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!provider) {
                console.error('Provider is undefined');
                return;
            }

            try {
                const activeServices = await getActiveService(provider.provider.id, provider.token);
                for (let i = 0; i < activeServices.length; i++) {
                    if (activeServices[i].status === "Active") {
                        setActiveService(activeServices[i]);
                        const clientData = await getClient(activeServices[i].clientId, provider.token);
                        setClient(clientData);
                        break;
                    }
                }

                const historyServices = await getHistory(provider.provider.id, provider.token);
                setHistory(historyServices || []); // Asegurarse de que history siempre sea un array
            } catch (err) {
                console.error('Cant get history:', err);
            }
        };

        if (provider) {
            fetchData();
        }
    }, [provider, getActiveService, getHistory, getClient]);

    const handleLogOut = () => {
        logout();
    };

    const clientContact = () => {
        if (client && client.phone) {
            const clientPhone = client.phone;
            router.push(`https://wa.me/${clientPhone}`);
        } else {
            console.error('Client phone is not available');
        }
    }

    const finishService = async () => {
        if (activeService) {
            await markAsFinished(JSON.stringify(activeService.id), provider.token);
            router.push("/");
        } else {
            console.error('No active service to finish');
        }
    }

    return (
        <AuthGuard>
            <div className={styles.main}>
                <Navbar />
                <div className={styles.topSection}>
                    <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={500} height={200} />
                    <h1 className={styles.title}>Mi perfil</h1>
                </div>
                <div className={styles.bottomSection}>
                    <div className={styles.userDataContainer}>
                        <div className={styles.userData}>
                            <h2 className={styles.dataContainerTitle}>Servicio activo</h2>
                            {activeService ? (
                                <div className={styles.innerData}>
                                    <h2 className={styles.activeServiceTitle}>{activeService.title}</h2>
                                    <p><strong>Tipo de servicio:</strong> {activeService.category}</p>
                                    <p><strong>Fecha de la solicitud:</strong> {activeService.requestDate}</p>
                                    <p><strong>Fecha de realización:</strong> {activeService.finishDate}</p>
                                    {client && (
                                        <>
                                            <p><strong>Nombre del cliente:</strong> {client.name}</p>
                                            <p><strong>Número de teléfono:</strong> {client.phone}</p>
                                            <p><strong>Dirección:</strong> {client.address}</p>
                                        </>
                                    )}
                                    <p><strong>Comentarios:</strong> {activeService.description}</p>
                                    <div className={styles.buttonSection}>
                                        <button className={styles.onRoad}>En camino</button>
                                        <button onClick={finishService} className={styles.doneService}>Servicio completado</button>
                                    </div>
                                    <div className={styles.buttonSection}>
                                        <button onClick={clientContact} className={styles.contactClient}>Contactar cliente</button>
                                        <button className={styles.cancelService}>Cancelar servicio</button>
                                    </div>
                                </div>
                            ) : (
                                <h3>No hay servicios activos</h3>
                            )}
                        </div>
                        <div className={styles.userData}>
                            <button onClick={() => setCalendarVisible(!calendar)} className={styles.editData} id='editData'>Ver mi calendario</button>
                            <button onClick={handleLogOut} className={styles.logOut} id='logOut'>Cerrar sesión</button>
                        </div>
                    </div>
                    {calendar && (
                        <CalendarComponent />   
                    )}

                    <div className={styles.userServices}>
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
                            {history.filter(service => service.status !== 'Active').length > 0 ? (
                                history.filter(service => service.status !== 'Active').map((item, index) => (
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
    );
};

export default ProviderProfile;
