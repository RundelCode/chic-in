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
import { format } from 'date-fns';

const PRICES = {
  manicure: 15000,
  pedicure: 20000,
  handsAndFeets: 35000,
  colorChange: 10000,
  semiPermanentManicure: 50000,
  semiPermanentPedicure: 40000,
  semiPermanentHandsAndFeets: 90000,
  softGelExtensions: 70000,
  softGelExtensionsHandsAndFeets: 140000,
  acrylicBath: 60000,
  acrylicBathHandsAndFeets: 120000,
};

export default function Home() {
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comments, setComments] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hasActiveService, setHasActiveService] = useState(false);

  const [manicureCount, setManicureCount] = useState(0);
  const [pedicureCount, setPedicureCount] = useState(0);
  const [handsFeetCount, setHandsFeetCount] = useState(0);

  const updatePrice = () => {
    const DELIVERY_FEE = 20000;
    if (serviceType == "Tradicional") {
      const newPrice = (manicureCount * PRICES.manicure) + (pedicureCount * PRICES.pedicure) + (handsFeetCount * PRICES.handsAndFeets);
      setPrice(newPrice);
      setTotalPrice(newPrice + DELIVERY_FEE);
    }
    else if(serviceType == "Semipermanente"){
      const newPrice = (manicureCount * PRICES.semiPermanentManicure) + (pedicureCount * PRICES.semiPermanentPedicure) + (handsFeetCount * PRICES.semiPermanentHandsAndFeets);
      setPrice(newPrice);
      setTotalPrice(newPrice + DELIVERY_FEE);
    }
    else if(serviceType == "Gel"){
      const newPrice = (manicureCount * PRICES.softGelExtensions) + (pedicureCount * PRICES.softGelExtensions) + (handsFeetCount * PRICES.softGelExtensionsHandsAndFeets);
      setPrice(newPrice);
      setTotalPrice(newPrice + DELIVERY_FEE);
    }
    else if(serviceType == "Acrilico"){
      const newPrice = (manicureCount * PRICES.acrylicBath) + (pedicureCount * PRICES.acrylicBath) + (handsFeetCount * PRICES.acrylicBathHandsAndFeets);
      setPrice(newPrice);
      setTotalPrice(newPrice + DELIVERY_FEE);
    }
  };

  useEffect(() => {
    updatePrice();
  }, [manicureCount, pedicureCount, handsFeetCount, serviceType]);

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
            if (services[i].status === "Active" || services[i].status === "Pending") {
              setHasActiveService(true);
              break;
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
      setUserId(pendingService.id);
    }
  }, [user, loginToken, pendingService, getActiveService, requestService]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (hasActiveService) {
      alert("No puedes crear un nuevo servicio mientras tengas uno activo.");
      return;
    }
    const token = Cookies.get("token");
    const now = new Date();
    const formattedFinishDate = dateTime ? format(new Date(dateTime), 'yyyy-MM-dd') : '';
  
    if (!token) {
      const categories = [];
      if (manicureCount > 0) categories.push("Manicure");
      if (pedicureCount > 0) categories.push("Pedicure");
      if (handsFeetCount > 0) categories.push("Manos y Pies");
      const service = {
        title: `Nuevo servicio de uñas de tipo ${serviceType}`,
        description: comments,
        price: parseFloat(totalPrice),
        requestDate: now.toISOString(),
        finishDate: formattedFinishDate,
        status: 'Pending',
        clientId: null,
        providerId: null,
        city: city,
        category: `${categories}`
      };
      setServiceAsPending(service);
      router.push("/Login");
    } else {
      const decodedToken = JSON.parse(token);
  
      const service = {
        title: `Nuevo servicio de uñas de tipo ${serviceType}`,
        description: comments,
        price: parseFloat(totalPrice),
        requestDate: now.toISOString(),
        finishDate: formattedFinishDate,
        status: 'Pending',
        clientId: decodedToken.client.id,
        providerId: null,
        city: city,
        category: `Manicure: ${manicureCount}, Pedicure: ${pedicureCount}, Manos y pies: ${handsFeetCount}`
      };
      console.log(service);
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
            <p>Tienes un servicio activo o pendiente. No puedes solicitar otro hasta que se complete.</p>
            <Link href="/Profile" className={styles.profileLink}>Ir a mi perfil</Link>
          </div>
        ) : (
          <form id="serviceForm" className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow2}>
              <div className={styles.formInputContainer3}>
                <p>Manicure</p>
                <div className={styles.counterContainer}>
                  <button type="button" onClick={() => handleDecrement('manicure')} className={styles.counterButton}>-
                  </button>
                  <span>{manicureCount}</span>
                  <button type="button" onClick={() => handleIncrement('manicure')} className={styles.counterButton}>+
                  </button>
                </div>
              </div>
              <div className={styles.formInputContainer3}>
                <p>Pedicure</p>
                <div className={styles.counterContainer}>
                  <button type="button" onClick={() => handleDecrement('pedicure')} className={styles.counterButton}>-
                  </button>
                  <span>{pedicureCount}</span>
                  <button type="button" onClick={() => handleIncrement('pedicure')} className={styles.counterButton}>+
                  </button>
                </div>
              </div>
              <div className={styles.formInputContainer3}>
                <p>Manos y pies</p>
                <div className={styles.counterContainer}>
                  <button type="button" onClick={() => handleDecrement('handsFeet')} className={styles.counterButton}>-
                  </button>
                  <span>{handsFeetCount}</span>
                  <button type="button" onClick={() => handleIncrement('handsFeet')} className={styles.counterButton}>+
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formInputContainer}>
                <p>Técnica</p>
                <select
                  className={styles.selectBox}
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value)
                  }}
                  required
                >
                  <option value="">¿Qué técnica deseas?</option>
                  <option value="Tradicional">Tradicional</option>
                  <option value="Semipermanente">Semipermanente</option>
                  <option value="Gel">Extensión en soft gel</option>
                  <option value="Acrilico">Baño en acrílico</option>
                </select>
              </div>

              <div className={styles.formInputContainer}>
                <p>Fecha y hora</p>
                <input
                  id="dateAndTime"
                  type="datetime-local"
                  className={styles.formInput}
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                />
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
              <p>Precio del servicio: $ {price}</p>
              <p>Precio del domicilio: $ 20000</p>
              <p>Total: {totalPrice} (COP)</p>
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
