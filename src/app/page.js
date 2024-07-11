'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./context/authContext";
import { useService } from "./context/serviceContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comments, setComments] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const { requestService } = useService();
  const router = useRouter();

  useEffect(()=>{
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const now = new Date();
      const service = {
        id: "678910",
        title: serviceType,
        description: comments,
        price: price,
        requestDate: now.toISOString(),
        finishDate: dateTime,
        status: 'active',
        clientId: user.id,
        providerId: "",
        city: city,
        category: serviceType
      };

    try {
      requestService(service);
      setShowModal(true);
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.topSection}>
        <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={'500'} height={'200'} />
        <h1 className={styles.title}>Solicitar un servicio</h1>
      </div>
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

      {showModal && (
        <div id="confirmation" className={styles.confirmation}>
          <div className={styles.ConfirmationModal}>
            <h3 className={styles.confirmationText}>¡Servicio solicitado con éxito!</h3>
            <Link className={styles.serviceListLink} href={'/Profile'}>Ir a la lista de servicios</Link>
          </div>
        </div>
      )}
    </main>
  );
}
