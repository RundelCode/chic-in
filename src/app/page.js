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
  const [addService, setAddService] = useState(false)
  const [serviceList, setServiceList] = useState([])
  const [temporalServiceType, setTemporalServiceType] = useState("Manicure")
  const [temporalServiceTechnique, setTemporalServiceTechnique] = useState("Tradicional")
  const [errorMicroservices, setErrorMicroservices] = useState(false)

  const updatePrice = () => {
    const DELIVERY_FEE = 20000;
    let total = 0;
    for (let i = 0; i < serviceList.length; i++) {
      total = total + serviceList[i].price;
    }
    setPrice(total);
    setTotalPrice(total + DELIVERY_FEE);
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

    if(serviceList.length>0){
      if (!token) {
        const service = {
          "serviceData": {
            title: `Nuevo servicio de uñas`,
            description: comments,
            price: parseFloat(totalPrice),
            requestDate: now.toISOString(),
            finishDate: formattedFinishDate,
            status: 'Pending',
            clientId: decodedToken.client.id,
            providerId: null,
            city: city,
            category: `Uñas`
          },
          "microservices": serviceList
  
        };
        setServiceAsPending(service);
        router.push("/Login");
      } else {
        const decodedToken = JSON.parse(token);
  
        const service = {
          "serviceData": {
            title: `Nuevo servicio de uñas`,
            description: comments,
            price: parseFloat(totalPrice),
            requestDate: now.toISOString(),
            finishDate: formattedFinishDate,
            status: 'Pending',
            clientId: decodedToken.client.id,
            providerId: null,
            city: city,
            category: `Uñas`
          },
          "microservices": serviceList
  
        };
        console.log(service)
        requestService(service, loginToken);
        setShowModal(true);
      }
    }else{
      setErrorMicroservices(true)
    }
  };

  const handleSetPrice = () => {
    if (temporalServiceType === "Manicure") {
      if (temporalServiceTechnique === "Tradicional") {
        return 15000;
      } else if (temporalServiceTechnique === "Semipermanente") {
        return 50000;
      } else if (temporalServiceTechnique === "Gel") {
        return 70000;
      } else if (temporalServiceTechnique === "Acrilico") {
        return 60000;
      }
    } else if (temporalServiceType === "Pedicure") {
      if (temporalServiceTechnique === "Tradicional") {
        return 20000;
      } else if (temporalServiceTechnique === "Semipermanente") {
        return 40000;
      } else if (temporalServiceTechnique === "Gel") {
        return 70000;
      } else if (temporalServiceTechnique === "Acrilico") {
        return 60000;
      }
    } else if (temporalServiceType === "Manos y Pies") {
      if (temporalServiceTechnique === "Tradicional") {
        return 35000;
      } else if (temporalServiceTechnique === "Semipermanente") {
        return 90000;
      } else if (temporalServiceTechnique === "Gel") {
        return 140000;
      } else if (temporalServiceTechnique === "Acrilico") {
        return 120000;
      }
    }
  };

  const addNewService = (event) => {
    event.preventDefault();
    setErrorMicroservices(false);
    let servicePrice = handleSetPrice();
    const service = {
        serviceType: temporalServiceType,
        technique: temporalServiceTechnique,
        price: servicePrice
    };
    const isServiceInList = serviceList.some(
        (s) => s.serviceType === service.serviceType && s.technique === service.technique
    );
    if (isServiceInList) {
        console.log("Este servicio ya está en la lista.");
        return;
    }
    serviceList.push(service);
    setTemporalServiceTechnique("Tradicional");
    setTemporalServiceType("Manicure");
    setAddService(false);
    updatePrice();

    console.log(serviceList);
};

  return (
    <TypeGuard>
      <main className={styles.main}>
        <Navbar />
        {hasActiveService ? (
          <div className={styles.alert}>
            <p>Tienes un servicio activo o pendiente. No puedes solicitar otro hasta que se complete.</p>
            <Link href="/Profile" className={styles.profileLink}>Ir a mi perfil</Link>
          </div>
        ) : (
          <form id="serviceForm" className={styles.form} onSubmit={handleSubmit}>
            <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={500} height={200} />
            <h1 className={styles.title}>Uñas a domicilio</h1>
            <div className={styles.addNewService}>
              <button type="button" onClick={() => setAddService(true)} className={styles.addNewServiceButton}><p>Agrega un servicio</p></button>
            </div>
            {errorMicroservices == true? (
                <p>Agrega un servicio primero.</p>
              ): (
                <></>
              )}
            <div className={styles.addedServices}>
              {serviceList.length > 0 ? (
                serviceList.map((item, index) => (
                  <div className={styles.addedService} key={index}> <p>{item.type}</p><p>{item.technique}</p><p>${item.price}</p></div>
                ))
              ) : (
                <p>No hay servicios aun</p>
              )}
            </div>
            <div className={styles.formRow}>
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
            </div>
            <div className={styles.formRow}>
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
              <div className={styles.formInputContainer}>
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
              <p>Total: $ {totalPrice} (COP)</p>
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

        {addService && (
          <div className={styles.addServiceModal}>
            <form className={styles.addServiceForm} onSubmit={addNewService}>
              <h2>Agregar Servicio</h2>
              <div className={styles.addServiceinputContainer}>
                <p>Cuál servicio buscas?</p>
                <select name="Selecciona un servicio" className={styles.selectBox} required
                  onChange={(e) => {
                    setTemporalServiceType(e.target.value)
                  }}>
                  <option value={"Manicure"} selected>Manicure</option>
                  <option value={"Pedicure"}>Pedicure</option>
                  <option value={"Manos y Pies"}>Manos y pies</option>
                </select>
              </div>
              <div className={styles.addServiceinputContainer}>
                <p>¿Cuál técnica de uñas deseas?</p>
                <select name="Selecciona una tecnica" className={styles.selectBox} required
                  onChange={(e) => {
                    setTemporalServiceTechnique(e.target.value)
                  }}>
                  <option value="Tradicional" selected>Tradicional</option>
                  <option value="Semipermanente">Semipermanente</option>
                  <option value="Gel">Extensión en soft gel</option>
                  <option value="Acrilico">Baño en acrílico</option>
                </select>
              </div>
              <button type="submit" className={styles.addServiceButtom}>Agregar servicio</button>
            </form>
            <button type="cancel" className={styles.cancelAddServiceButton} onClick={() => setAddService(false)}>Cancelar</button>
          </div>
        )}
      </main>
    </TypeGuard>
  );
}
