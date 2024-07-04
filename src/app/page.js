'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./Components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [phone, setPhone] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [price, setPrice] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [comments, setCommets] = useState("")
  const [showModal, setShowModal] = useState(false);

  function sendService() {
    
    setShowModal(true);
  }

  return (
    <main className={styles.main}>
      <Navbar></Navbar>
      <div className={styles.topSection}>
        <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={'500'} height={'200'} />
        <h1 className={styles.title}>Solicitar un servicio</h1>
      </div>
      <div className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formInputContainer}>
            <p>¿Que servicio estas buscando?</p>
            <select id="serviceType" className={styles.selectBox}>
              <option value={''}>Selecciona una opción</option>
              <option value={'Lifting de pestañas'}>Lifting de pestañas</option>
              <option value={'Uñas'}>Uñas</option>
            </select>
          </div>
          <div className={styles.formInputContainer}>
            <p>¿Que servicio estas buscando?</p>
            <input id="dateAndTime" type="datetime-local" className={styles.formInput} />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formInputContainer}>
            <p>Precio(Tentativo)</p>
            <input id="price" type="number" className={`${styles.formInput} ${styles.noArrows}`} placeholder="$(COP)" />
          </div>
          <div className={styles.formInputContainer}>
            <p>Medio de pago</p>
            <select className={styles.selectBox}>
              <option value={''}>Selecciona una opción</option>
              <option value={'Efectivo'}>Efectivo</option>
              <option value={'Tarjeta de credito'}>Tarjeta de credito</option>
              <option value={'Tarjeta de devito'}>Tarjeta de devito</option>
              <option value={'Paypal'}>Paypal</option>
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formInputContainer}>
            <p>Telefono</p>
            <input onChange={(e) => setPhone(e.target.value)} type="number" className={`${styles.formInput} ${styles.noArrows}`} placeholder="(+57) Telefono" />
          </div>
          <div className={styles.formInputContainer}>
            <p>Ciudad</p>
            <input type="text" className={styles.formInput} placeholder="Ciudad" />
          </div>
        </div>

        <div className={styles.longFormRow}>
          <p>Dirección</p>
          <input type="text" className={styles.formInput} placeholder="Dirección" />
        </div>

        <div className={styles.longFormRow}>
          <p>Comentarios</p>
          <input type="text" className={styles.formInput} placeholder="Cuentanos los detalles de tu servicio" />
        </div>
        <div className={styles.formRow}>
          <button onClick={sendService} className={styles.sendButton}>Solicitar servicio</button>
        </div>
      </div>

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
