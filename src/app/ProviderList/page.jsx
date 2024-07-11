'use client';
import Image from "next/image";
import styles from "./provider.module.css";
import Navbar from "../Components/Navbar";

const providerList = () => {
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
          <select className={styles.filterSelect}>
            <option>Relevancia</option>
            <option>Precio</option>
            <option>Calificación</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tipo de servicio</label>
          <select className={styles.filterSelect}>
            <option>Lifting de pestañas</option>
            <option>Manicure</option>
            <option>Pedicure</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Ciudad</label>
          <select className={styles.filterSelect}>
            <option>Pereira</option>
            <option>Medellín</option>
            <option>Bogotá</option>
          </select>
        </div>
      </div>
      <div className={styles.servicesContainer}>
        {/* Tarjeta de ejemplo, puedes duplicar este bloque para más tarjetas */}
        <div className={styles.serviceCard}>
          <h3 className={styles.serviceTitle}>Lifting de pestañas</h3>
          <span className={styles.serviceDistance}>12km</span>
          <p className={styles.serviceTime}>07/07/2024 - 03:00 PM</p>
          <p className={styles.serviceDescription}>
            Me gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el día de mañana.
          </p>
          <p className={styles.servicePrice}>$30.000 - Efectivo(COP)</p>
          <button className={styles.serviceButton}>Aceptar servicio</button>
        </div>

      </div>
    </div>
  );
}

export default providerList;

