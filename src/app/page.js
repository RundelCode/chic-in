'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./context/authContext";
import { useService } from "./context/serviceContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import TypeGuard from "./Components/TypeGuard.home";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comments, setComments] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hasActiveService, setHasActiveService] = useState(false);
  const [selectedRole, setSelectedRole] = useState('clients');

  const { requestService, setServiceAsPending, pendingService, getActiveService, setUserId } = useService();
  const { user, loginToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkActiveService = async () => {
      if (user) {
        try {
          const services = await getActiveService(user.id, loginToken);
          for (let i = 0; i < services.length; i++) {
            if (services[i].status === "Active") {
              setActiveService(service[i]);
            }
          }

        } catch (error) {
          console.error('Error getting active service:', error);
        }
      }
    };
    checkActiveService();

    if (pendingService) {
      requestService(pendingService, loginToken);
      setUserId(pendingService.id)
      setShowModal(true);
    }
  }, [user, loginToken, pendingService, getActiveService, requestService]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (hasActiveService) {
      alert("No puedes crear un nuevo servicio mientras tengas uno activo.");
      return;
    }

    const token = Cookies.get("token");
    const decodedToken = JSON.parse(token)
    const now = new Date();
    const service = {
      title: serviceType,
      description: comments,
      price: parseFloat(price),
      requestDate: now.toISOString(),
      finishDate: dateTime,
      status: 'Pending',
      clientId: decodedToken.client.id,
      providerId: null,
      city: city,
      category: serviceType
    };

    if (!token) {
      setServiceAsPending(service);
      router.push("/Login");
    } else {
      requestService(service, loginToken);
      setShowModal(true);
    }
  };

  return (
    <TypeGuard>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.topSection}>
          <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={500} height={200} />
          <h1 className={styles.title}>Solicitar un servicio</h1>
        </div>
        {hasActiveService ? (
          <div className={styles.alert}>
            <p>Tienes un servicio activo. No puedes solicitar otro hasta que se complete.</p>
            <Link href="/Profile" className={styles.profileLink}>Ir a mi perfil</Link>
          </div>
        ) : (
            <form id="serviceForm" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <div className={styles.formInputContainer}>
                        <p>¿Qué servicio estás buscando?</p>
                        <select
                            id="serviceType"
                            className={styles.selectBox}
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Lifting de pestañas">Lifting de pestañas</option>
                            <option value="Uñas">Uñas</option>
                        </select>
                    </div>
                    <div className={styles.formInputContainer}>
                        <p>Tecnica</p>
                        <select
                            id="serviceType"
                            className={styles.selectBox}
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            required
                        >
                            <option value="">Tradicional</option>
                            <option value="Lifting de pestañas">Lifting de pestañas</option>
                            <option value="Uñas">Uñas</option>
                        </select>
                    </div>
                </div>
                <div className={styles.roleSwitch}>
                    <button
                        className={`${styles.roleButton} ${selectedRole === 'clients' ? styles.selected : ''}`}
                        onClick={() => setSelectedRole('clients')}>
                        Manos
                    </button>
                    <button
                        className={`${styles.roleButton} ${selectedRole === 'providers' ? styles.selected : ''}`}
                        onClick={() => setSelectedRole('providers')}>
                        Pies
                    </button>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formInputContainer}>
                        <p>Precio (Tentativo)</p>
                        <input
                            id="price"
                            type="number"
                            className={`${styles.formInput} ${styles.noArrows}`}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="$(COP)"
                            required
                        />
                    </div>
                    <div className={styles.formInputContainer}>
                        <p>Medio de pago</p>
                        <select className={styles.selectBox} required>
                            <option value="">Selecciona una opción</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                            <option value="Tarjeta de débito">Tarjeta de débito</option>
                            <option value="Paypal">Paypal</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formInputContainer}>
                        <p>Teléfono</p>
                        <input
                            type="tel"
                            className={`${styles.formInput} ${styles.noArrows}`}
                            placeholder="(+57) Teléfono"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formInputContainer}>
                        <p>Ciudad</p>
                        <input
                            type="text"
                            className={styles.formInput}
                            placeholder="Ciudad"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/*<div className={styles.longFormRow}>
              <p>Dirección</p>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>*/}

                <div className={styles.longFormRow}>
                    <p>Comentarios</p>
                    <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Cuéntanos los detalles de tu servicio"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formRow}>
                    <button type="submit" className={styles.sendButton}>Solicitar servicio</button>
                </div>
            </form>
        )}

          {showModal && (
              <div id="confirmation" className={styles.confirmation}>
                  <div className={styles.ConfirmationModal}>
                      <h3 className={styles.confirmationText}>¡Servicio solicitado con éxito!</h3>
                      <Link className={styles.serviceListLink} href={'/Profile'}>Ir a la lista de servicios</Link>
                  </div>
              </div>
          )}
      </main>
    </TypeGuard>
  );
}
