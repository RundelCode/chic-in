'use client';
import Image from "next/image";
import Link from "next/link";
import styles from "./provider.module.css";
import Navbar from "../Components/Navbar";
import { useAuth } from "../context/authContext";
import { useService } from "../context/serviceContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import AuthGuard from "../Components/AuthGuard";
import { format } from 'date-fns';

const ProviderList = () => {
  const { acceptService, getAllServices } = useService();
  const { getClient } = useAuth();
  const router = useRouter();

  const [provider, setProvider] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({})
  const [detailModal, setDetailModalVisivility] = useState(false)

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/Login");
    } else {
      const parsedToken = JSON.parse(token);
      setProvider(parsedToken);
      fetchData(parsedToken.token);
    }
  }, [router]);


  const handleDetails = (serviceDetails) => {
    setDetailModalVisivility(true);
    setDetails(serviceDetails)
    console.log(detailModal)
    console.log(details.Microservices)
  }


  const fetchData = async (token) => {
    try {
      const services = await getAllServices(token);
      let list = services.filter(service => service.status === "Pending");
      setServiceList(Array.isArray(list) ? list : []);
      setLoading(false);
    } catch (err) {
      setError("Error obteniendo los servicios");
      setLoading(false);
    }
  };

  const handleAcceptService = async (serviceId) => {
    try {
      await acceptService(serviceId, provider.provider.id, provider.token);
      setShowModal(true);
    } catch (err) {
      console.error("Error aceptando el servicio:", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), 'MMM d, yyyy h:mm a') : '';
  };

  if (loading) {
    return <div className={styles.loadingScreen}>
      <h2>CARGANDO SERVICIOS...</h2>
      <div className={styles.loader}>

      </div>
    </div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <AuthGuard>
      <div>
        <Navbar />
        <div className={styles.topSection}>
          <Image
            className={styles.logo}
            src='/images/LogoChicIn.png'
            alt="Chic In"
            width={500}
            height={200}
          />
          <h1 className={styles.title}>Lista De Servicios</h1>
        </div>
        <div className={styles.servicesContainer}>
          {serviceList.length > 0 ? (
            serviceList.map(service => (
              <div key={service.id} className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.city}</p>
                <p className={styles.serviceTime}>{formatDate(service.finishDate)}</p>
                <p className={styles.serviceDescription}>{service.description}</p>
                <p className={styles.servicePrice}>${service.price} - Efectivo(COP)</p>
                <button
                  className={styles.detailsButton}
                  onClick={() => handleDetails(service)}
                >
                  Ver detalles
                </button>
                <button
                  className={styles.serviceButton}
                  onClick={() => handleAcceptService(service.id)}
                >
                  Aceptar servicio
                </button>
              </div>
            ))
          ) : (
            <h2 className={styles.nullServices}>No hay servicios</h2>
          )}
        </div>
        {showModal && (
          <div className={styles.confirmation}>
            <div className={styles.confirmationModal}>
              <h3 className={styles.confirmationText}>¡Servicio aceptado con éxito!</h3>
              <Link className={styles.serviceListLink} href={'/Profile'}>Ir a la lista de servicios</Link>
              <button onClick={closeModal} className={styles.closeButton}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
      {detailModal && (
        <div className={styles.detailsModal}>
          <div className={styles.details}>
            <div className={styles.detailsTextSection}>
              <h2>{details.title}</h2>
              <h4>Dirección: {details.city}</h4>
              <h5>Fecha de la solicitud {details.requestDate}</h5>
              <h5>Fecha del servicio {details.finishDate}</h5>
              <h5>Precio total: ${details.price} - Efectivo(COP)</h5>
              <h5>Descripción: {details.description}</h5>
              <div className={styles.detailsMicroServices}>
                <h5>Microservicios: </h5>
                {details.Microservices.map(microservice=>{
                  return(
                    <li>{`${microservice.serviceType} ${microservice.technique}`}</li>
                  )
                })}
              </div> 
            </div>
            <div className={styles.detailsButtonSection}>
              <button
                className={styles.detailsButton}
                onClick={() => setDetailModalVisivility(false)}
              >
                Atras
              </button>
              <button
                className={styles.serviceButton}
                onClick={() => handleAcceptService(details.id)}
              >
                Aceptar servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

export default ProviderList;
