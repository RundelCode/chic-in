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

const ProviderList = () => {
  const { acceptService, getAllServices } = useService();
  const { loginToken, user } = useAuth();
  const router = useRouter();

  const [provider, setProvider] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState("Relevancia");
  const [serviceType, setServiceType] = useState("Lifting de pestañas");
  const [city, setCity] = useState("Pereira");

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      setProvider(JSON.parse(token));
      if (!token) {
        router.push("/LogIn");
      } else {
        try {
          const services = await getAllServices(loginToken);
          const list = [];
          for (let i = 0; i < services.length; i++) {
            if (services[i].status !== "Active") {
              list.push(services[i]);
            }
          }
          setServiceList(Array.isArray(list) ? list : []);
          setLoading(false);
        } catch (err) {
          setError("Error fetching services");
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [loginToken, router, getAllServices]);

  const handleAcceptService = (serviceId) => {
    acceptService(serviceId, provider.provider.id, provider.token);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
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
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Ordenar por</label>
          <select className={styles.filterSelect} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option>Relevancia</option>
            <option>Precio</option>
            <option>Calificación</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tipo de servicio</label>
          <select className={styles.filterSelect} value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option>Lifting de pestañas</option>
            <option>Manicure</option>
            <option>Pedicure</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Ciudad</label>
          <select className={styles.filterSelect} value={city} onChange={(e) => setCity(e.target.value)}>
            <option>Pereira</option>
            <option>Medellín</option>
            <option>Bogotá</option>
          </select>
        </div>
      </div>
      <div className={styles.servicesContainer}>
        {serviceList.length > 0 ? (
          serviceList.map(service => (
            <div key={service.id} className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceTime}>{new Date(service.requestDate).toLocaleDateString()} - {new Date(service.requestDate).toLocaleTimeString()}</p>
              <p className={styles.serviceDescription}>{service.description}</p>
              <p className={styles.servicePrice}>${service.price} - Efectivo(COP)</p>
              <button
                className={styles.serviceButton}
                onClick={() => handleAcceptService(service.id, service)}
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
  );
};

export default ProviderList;
