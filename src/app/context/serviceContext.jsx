'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

const ServiceContext = createContext();

const Service = {
    id: "678910",
    title: "Lifting de pestañas en la ciudad de pereira",
    description: "jme gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el dia de mañana.",
    price: 150000,
    requestDate: "30/06/2024",
    finishDate: "01/07/2024",
    status: "active",
    clientId: "12345",
    providerId: "2468",
    city: "Pereira",
    category: "Lifting de pestañas"
}

const serviceList = [
    {
        id: "678910",
        title: "Lifting de pestañas en la ciudad de pereira",
        description: "jme gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el dia de mañana.",
        price: 150000,
        requestDate: "30/06/2024",
        finishDate: "01/07/2024",
        status: "active",
        clientId: "12345",
        providerId: "2468",
        city: "Pereira",
        category: "Lifting de pestañas"
    },
    {
        id: "678910",
        title: "Lifting de pestañas en la ciudad de pereira",
        description: "jme gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el dia de mañana.",
        price: 150000,
        requestDate: "30/06/2024",
        finishDate: "01/07/2024",
        status: "active",
        clientId: "12345",
        providerId: "2468",
        city: "Pereira",
        category: "Lifting de pestañas"
    },
    {
        id: "678910",
        title: "Lifting de pestañas en la ciudad de pereira",
        description: "jme gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el dia de mañana.",
        price: 150000,
        requestDate: "30/06/2024",
        finishDate: "01/07/2024",
        status: "active",
        clientId: "12345",
        providerId: "2468",
        city: "Pereira",
        category: "Lifting de pestañas"
    },
    {
        id: "678910",
        title: "Lifting de pestañas en la ciudad de pereira",
        description: "jme gustaría agendar una cita para un lifting de pestañas ya que tengo un matrimonio el dia de mañana.",
        price: 150000,
        requestDate: "30/06/2024",
        finishDate: "01/07/2024",
        status: "active",
        clientId: "12345",
        providerId: "2468",
        city: "Pereira",
        category: "Lifting de pestañas"
    }

]

export const ServiceProvider = ({ children }) => {
    const [activeService, setActiveService] = useState(null);
    const router = useRouter()

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const APIKEY = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
        setActiveService(JSON.stringify(Service))
        console.log(APIKEY)
    }, [])

    const requestService = (service)=>{
        console.log(service)
    }

    const getServices = () => {

    }

    const getActiveService = () => {

    }

    const aceptService = () => {

    }

    const getHistory = (userId) => {
        return(serviceList)
    }

    const cancelService = (serviceId) => {
        console.log(`El servicio ${serviceId} ha sido cancelado`)
    }

    return (
        <ServiceContext.Provider value={{getHistory, activeService, getServices, getActiveService, aceptService, cancelService }}>
            {children}
        </ServiceContext.Provider>
    );
}

export const useService = () => useContext(ServiceContext);