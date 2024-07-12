'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Cookies from 'js-cookie';


const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
    const [activeService, setActiveService] = useState(null);
    const [pendingService, setPendingService] = useState(null);
    const router = useRouter();

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
        }
        catch (err) {
            console.error(`Error gUploading the service: ${err}`)
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
            const response = await axios.put(`${APIURL}/api/services/${serviceId}`, {status: "Active", providerId: providerId }, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            router.push("/providerProfile")
            
            
        } catch (err) {
            console.error(`Error ${err}`);
        }
    };

    const markAsOnRoad = (serviceId, loginToken) => {

    }

    const markAsFinished = async (serviceId, loginToken) => {
        try {
            const response = await axios.put(`${APIURL}/api/services/${serviceId}`, {status: "Finished"}, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            router.push("/providerProfile")
            
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

    const cancelService =  async (serviceId) => {
        try {
            const token = Cookies.get("token");
            const decodedToken = JSON.parse(token)
            const response = await axios.put(`${APIURL}/api/services/${serviceId}`, {status: "Declined"}, {
                headers: {
                    'Authorization': `Bearer ${decodedToken.token}`,
                    'Content-Type': 'application/json'
                }
            });
            router.push("/")    
            
            
        } catch (err) {
            console.error(`Error ${err}`);
        }
    }

    const setUserId =  async (serviceId) => {
        try {
            const token = Cookies.get("token");
            const decodedToken = JSON.parse(token)
            const response = await axios.put(`${APIURL}/api/services/${serviceId}`, {clientId: token.client.id}, {
                headers: {
                    'Authorization': `Bearer ${decodedToken.token}`,
                    'Content-Type': 'application/json'
                }
            });
            router.push("/")    
        } catch (err) {
            console.error(`Error ${err}`);
        }
    }

    return (
        <ServiceContext.Provider value={{ setUserId, markAsFinished, setActiveService, pendingService, setServiceAsPending, requestService, getHistory, activeService, getAllServices, getActiveService, acceptService, cancelService }}>
            {children}
        </ServiceContext.Provider>
    );
}

export const useService = () => useContext(ServiceContext);