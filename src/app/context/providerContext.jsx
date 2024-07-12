'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import axios from 'axios';

const providerContext = createContext();

export const ProviderProvider = ({ children }) => {
    const router = useRouter()

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const APIKEY = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
    }, [])

    const getProvider = async (providerId, loginToken) => {
        try {
            const token = Cookies.get("token");
            const decodedToken = JSON.parse(token)
            const response = await axios.get(`${APIURL}/api/providers/${providerId}`, {
                headers: {
                    'Authorization': `Bearer ${decodedToken.token}`,
                    'content-type': `aplication/json`
                }
            })
            return response.data;
        }
        catch (err) {
            console.error(`Error Getting the provider: ${err}`)
            return null;
        }
    }


    return (
        <providerContext.Provider value={{ getProvider }}>
            {children}
        </providerContext.Provider>
    );
}

export const useProvider = () => useContext(providerContext);