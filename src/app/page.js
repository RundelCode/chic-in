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

    // Estados y funciones para los contadores
  const [manicureCount, setManicureCount] = useState(0);
  const [pedicureCount, setPedicureCount] = useState(0);
  const [handsFeetCount, setHandsFeetCount] = useState(0);

  const handleIncrement = (type) => {
    if (type === 'manicure') setManicureCount(manicureCount + 1);
    if (type === 'pedicure') setPedicureCount(pedicureCount + 1);
    if (type === 'handsFeet') setHandsFeetCount(handsFeetCount + 1);
  };

  const handleDecrement = (type) => {
    if (type === 'manicure' && manicureCount > 0) setManicureCount(manicureCount - 1);
    if (type === 'pedicure' && pedicureCount > 0) setPedicureCount(pedicureCount - 1);
    if (type === 'handsFeet' && handsFeetCount > 0) setHandsFeetCount(handsFeetCount - 1);
  };

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
          <h1 className={styles.title}>Uñas a domicilio</h1>
        </div>
        {hasActiveService ? (
          <div className={styles.alert}>
            <p>Tienes un servicio activo. No puedes solicitar otro hasta que se complete.</p>
            <Link href="/Profile" className={styles.profileLink}>Ir a mi perfil</Link>
          </div>
        ) : (
            <form id="serviceForm" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow2}>
                    <div className={styles.formInputContainer3}>
                        <p>Manicure</p>
                        <div className={styles.counterContainer}>
                            <button onClick={() => handleDecrement('manicure')} className={styles.counterButton}>-
                            </button>
                            <span>{manicureCount}</span>
                            <button onClick={() => handleIncrement('manicure')} className={styles.counterButton}>+
                            </button>
                        </div>
                    </div>
                    <div className={styles.formInputContainer3}>
                        <p>Pedicure</p>
                        <div className={styles.counterContainer}>
                            <button onClick={() => handleDecrement('pedicure')} className={styles.counterButton}>-
                            </button>
                            <span>{pedicureCount}</span>
                            <button onClick={() => handleIncrement('pedicure')} className={styles.counterButton}>+
                            </button>
                        </div>
                    </div>
                    <div className={styles.formInputContainer3}>
                        <p>Manos y pies</p>
                        <div className={styles.counterContainer}>
                            <button onClick={() => handleDecrement('handsFeet')} className={styles.counterButton}>-
                            </button>
                            <span>{handsFeetCount}</span>
                            <button onClick={() => handleIncrement('handsFeet')} className={styles.counterButton}>+
                            </button>
                        </div>
                    </div>
                    {/*<div className={styles.formInputContainer}>
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
                    </div>*/}
                </div>
                <div className={styles.formRow}>
                    {/*<div className={styles.formInputContainer}>
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
                    </div>*/}
                    {/*<div className={styles.formInputContainer}>
                        <p>Medio de pago</p>
                        <select className={styles.selectBox} required>
                            <option value="">Selecciona una opción</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                            <option value="Tarjeta de débito">Tarjeta de débito</option>
                            <option value="Paypal">Paypal</option>
                        </select>
                    </div>*/}
                    <div className={styles.formInputContainer2}>
                        <p>Tecnica</p>
                        <select className={styles.selectBox} required>
                            <option value="">Que tecnica deseas?</option>
                            <option value="Efectivo">Tecnica 1</option>
                            <option value="Tarjeta de crédito">Tecnica 2</option>
                            <option value="Tarjeta de débito">Tecnica 3</option>
                            <option value="Paypal">Tecnica 4</option>
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

                <div className={styles.longFormRow}>
              <p>Dirección</p>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

                <div className={styles.longFormRow}>
                    <p>Comentarios</p>
                    <input
                        type="text"
                        className={styles.formInput2}
                        placeholder="Cuéntanos los detalles de tu servicio"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.prices}>
                    <p>Precio del servicio: $ 120.000 (COP)</p>
                    <p>Precio del domicilio: $ 12.000 (COP)</p>
                    <p>Total: $132.000 (COP)</p>
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
