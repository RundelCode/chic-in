'use client'
import { act, useEffect, useState } from 'react';
import styles from './providerProfile.module.css'
import Navbar from '../Components/Navbar';
import Image from 'next/image';

const userdata = {
    id: "1111",
    name: "Javier Gómez",
    email: "jgec070702@gmail.com",
    address: "Bonanza de la pradera torre 2 apto 806",
    phone: "3148735894"
}

const activeService = {
    id: "1111",
    title: "Pestañas a domicilio en Pereira",
    price: "120.000",
    type: "Lifting de pestañas",
    requestDate: "30/06/2024",
    finalDate: "01/03/2024-03:00PM",
    state: "Cancelado",
    payment: "Paypal",
    clientName: "Javier Gómez",
    clientPhone: "3148735894",
    clientAddress: "Bonanza de la pradera torre 2 apto 806",
    comments: "me gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el dia de mañana."
}

const ProviderProfile = () => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAdress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        setId(userdata.id);
        setName(userdata.name)
        setEmail(userdata.email)
        setAdress(userdata.address)
        setPhone(userdata.phone)
    }, [])

    const handdleMarkAsCompleted = (serviceId)=>{

    }

    const handleLogOut = ()=>{

    }

    const handleMarkAsCompleted= ()=>{

    }

    const showCalendar = ()=>{

    }
    return (
        <div className={styles.main}>
            <Navbar></Navbar>
            <div className={styles.topSection}>
                <Image className={styles.logo} src='/images/LogoChicIn.png' alt="Chic In" width={'500'} height={'200'} />
                <h1 className={styles.title}>Mi perfil</h1>
            </div>
            <div className={styles.bottomSection}>
                <div className={styles.userDataContainer}>
                    <div className={styles.userData}>
                        <h2 className={styles.dataContainerTitle}>Servicio activo</h2>
                        <div className={styles.innerData}>
                            <h2 className={styles.activeServiceTitle}>{activeService.title}</h2>
                            <p><strong>Tipo de servicio:</strong> {activeService.type}</p>
                            <p><strong>Metodo de pago:</strong> {activeService.payment} </p>
                            <p><strong>Fecha de la solicitud:</strong> {activeService.requestDate} </p>
                            <p><strong>Fecha de realzación:</strong> {activeService.finalDate} </p>
                            <p><strong>Nombre del cliente:</strong> {activeService.clientName} </p>
                            <p><strong>Numero de telefono:</strong> {activeService.clientPhone} </p>
                            <p><strong>Dirección:</strong> {activeService.clientAddress} </p>
                            <p><strong>Comentarios:</strong> {activeService.comments} </p>
                            <div className={styles.buttonSection}>
                                <button className={styles.onRoad}>En camino</button>
                                <button className={styles.doneService}>Servicio completado</button>
                            </div>
                            <div className={styles.buttonSection}>
                                <button className={styles.contactClient}>Contactar cliente</button>
                                <button className={styles.cancelService}>Cancelar servicio</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.userData}>
                            <button className={styles.editData} id='editData'>Ver mi calendario</button>
                            <button className={styles.logOut} id='logOut'>Cerrar sesión</button>
                    </div>
                </div>

                <div className={styles.userServices}>
                    <div className={styles.serviceHistory}>
                        <div className={styles.serviceTitle}>
                            <h2>Historial de servicios</h2>
                        </div>
                        <div className={styles.serviceIndex}>
                            <p className={styles.serviceText}>Titulo</p>
                            <p className={styles.serviceText}>Precio</p>
                            <p className={styles.serviceText}>Fecha de solicitadud</p>
                            <p className={styles.serviceText}>Fecha de realizacion</p>
                            <p className={styles.serviceText}>Estado</p>
                        </div>
                        <div className={styles.serviceInfo}>
                            <p className={styles.serviceInfoText}>{activeService.title}</p>
                            <p className={styles.serviceInfoText}>${activeService.price} COP</p>
                            <p className={styles.serviceInfoText}>{activeService.requestDate}</p>
                            <p className={styles.serviceInfoText}>{activeService.finalDate}</p>
                            <div className={styles.serviceInfoText}>
                                <div className={styles.serviceState}>{activeService.state}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProviderProfile;