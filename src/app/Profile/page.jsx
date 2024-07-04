'use client'
import { useEffect, useState } from 'react';
import styles from './profile.module.css'
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
    requestDate: "30/06/2024",
    finalDate: "01/03/2024-03:00PM",
    state: "Cancelado"
}


const Profile = () => {
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
                        <div className={styles.inputContainer}>
                            <p>Nombre completo</p>
                            <input type='text' className={styles.dataInput} placeholder={name}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <p>Correo electronico</p>
                            <input type='text' className={styles.dataInput} placeholder={email}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <p>Dirección</p>
                            <input type='text' className={styles.dataInput} placeholder={address}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <p>Telefono</p>
                            <input type='text' className={styles.dataInput} placeholder={phone}></input>
                        </div>
                        <div className={styles.inputContainer}>
                            <button className={styles.editData} id='editData'>Modificar datos</button>

                        </div>
                        <div className={styles.inputContainer}>
                            <button className={styles.logOut} id='logOut'>Cerrar sesión</button>
                        </div>
                    </div>

                </div>
                <div className={styles.userServices}>
                    <div className={styles.activeService}>
                        <div className={styles.serviceTitle}>
                            <h2>Servicio activo</h2>
                            <button className={styles.contactButton}>Contactar al proveedor</button>
                        </div>
                        <div className={styles.serviceIndex}>
                            <p className={styles.serviceText}>Titulo</p>
                            <p className={styles.serviceText}>Precio</p>
                            <p className={styles.serviceText}>Fecha de solicitadud</p>
                            <p className={styles.serviceText}>Fecha de realizacion</p>
                            <p className={styles.serviceText}></p>
                        </div>
                        <div className={styles.serviceInfo}>
                            <p className={styles.serviceInfoText}>{activeService.title}</p>
                            <p className={styles.serviceInfoText}>{activeService.price}</p>
                            <p className={styles.serviceInfoText}>{activeService.requestDate}</p>
                            <p className={styles.serviceInfoText}>{activeService.finalDate}</p>
                            <div className={styles.serviceInfoText}>
                                <button className={styles.cancelButton}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.serviceHistory}>
                        <div className={styles.serviceTitle}>
                            <h2>Servicio activo</h2>
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

export default Profile;