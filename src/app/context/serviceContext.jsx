'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Cookies from 'js-cookie';


const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const [activeService, setActiveService] = useState(null);
    const [pendingService, setPendingService] = useState(null);

    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {

    }, [])

    const requestService = async (service, loginToken) => {
        try {
            const response = await axios.post(`${APIURL}/api/services`, service, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return true;
        }
        catch (err) {
            console.error(`Error getting the active service: ${err}`)
            return false;
        }
    }

    const setServiceAsPending = (service) => {
        setPendingService(service);
    }


    const getAllServices = async (loginToken) => {
        try {
            const response = await axios.get(`${APIURL}/api/services`, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (err) {
            console.error(`Error getting all services: ${err}`)
        }
    }

    const getActiveService = async (userId, loginToken) => {
        try {
            const userType = Cookies.get('tokenType');
            const type = userType.slice(0, -1);
            const response = await axios.get(`${APIURL}/api/services/${type}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (err) {
            console.error(`Error getting the active service: ${err}`)
        }
    }

    const acceptService = async (serviceId, providerId, loginToken) => {
        try {
            const response = await axios.put(`${APIURL}/api/services/${serviceId}`, {status: "Finished", providerId: providerId }, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.error(`Error ${err}`);
        }
    };

    const markAsOnRoad = () => {

    }

    const markAsFinished = async (service, loginToken) => {
        let activeService;
        try {
            activeService = JSON.parse(service);
        } catch (err) {
            console.error(`Error parsing service: ${err}`);
            return;
        }

        try {
            const serviceId = activeService.id;
            activeService.status = "Finished";
            const response = await axios.put(`${APIURL}/api/services/${serviceId}`, activeService, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.error(`Error ${err}`);
        }
    };


    const getHistory = async (userId, loginToken) => {
        try {
            const userType = Cookies.get('tokenType');
            const type = userType.slice(0, -1);
            const response = await axios.get(`${APIURL}/api/services/${type}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (err) {
            console.error(`Error getting the active service: ${err}`)
        }
    }

    const cancelService = (serviceId) => {
        console.log(`El servicio ${serviceId} ha sido cancelado`)
    }

    return (
        <ServiceContext.Provider value={{ markAsFinished, setActiveService, pendingService, setServiceAsPending, requestService, getHistory, activeService, getAllServices, getActiveService, acceptService, cancelService }}>
            {children}
        </ServiceContext.Provider>
    );
}

export const useService = () => useContext(ServiceContext);