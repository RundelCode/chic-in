'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

const providerContext = createContext();

export const ProviderProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [tokenType, setTokenType] = useState(null)
    const router = useRouter()

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const APIKEY = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(token);
                setUser(decodedToken);
            } catch (error) {
                console.error('Error parsing token:', error);
                Cookies.remove('token'); // Remove invalid token
            }
        }
        const tokenType = Cookies.get("tokenType");
    }, [])

    const getProvider = async (providerId) => {
        try {
            const response = await axios.get(`${APIURL}/api/providers:${providerId}`, {
                headers: {
                    'Authorization': `${APIKEY}`,
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

    const register = async (userData) => {
        try {
            const response = await axios.post(`${APIURL}/api/providers/signup`, userData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
            const userToken = response.data;
            setProvider(userToken)
            Cookies.set('token', JSON.stringify(userToken), { expires: 7 });
            Cookies.set('tokenType', "provider", { expires: 7 });
            router.push('/')
        }
        catch (err) {
            console.error(`Error Loggin in: ${err}`)
        }
    }

    const editUserData = async (providerId, updatedData) => {
        try {
            const response = await axios.put(`${APIURL}/api/providers/:${providerId}`, updatedData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
        }
        catch (err) {
            console.error(`Error editing the provider data: ${err}`);
        }

    }

    const logOut = () => {
        setProvider(null);
        Cookies.remove("token");
        Cookies.remove("tokenType");
        router.push('/LogIn')
    }

    return (
        <providerContext.Provider value={{ provider, getProvider }}>
            {children}
        </providerContext.Provider>
    );
}

export const useProvider = () => useContext(providerContext);