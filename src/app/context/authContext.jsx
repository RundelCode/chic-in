'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const router = useRouter();

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
            }
        }
        const tokenType = Cookies.get("tokenType");
        if (tokenType) {
            setUserType(tokenType);
        }
    }, []);

    const login2 = (userData) => {
        setUser(userData);
        Cookies.set('token', JSON.stringify(userData), { expires: 7, path: '/' });
        Cookies.set('tokenType', 'clients', { expires: 7, path: '/' });
        router.push('/');
    };

    const login = async (userData) => {
        try {
            const response = await axios.post(`${APIURL}/api/${userType}/login`, userData, {
                headers: {
                    'Authorization': `Bearer ${APIKEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const userToken = response.data;
            setUser(userToken);
            Cookies.set('token', JSON.stringify(userToken), { expires: 7, path: '/' });
            Cookies.set('tokenType', 'clients', { expires: 7, path: '/' });
            router.push('/');
        } catch (err) {
            console.error(`Error Logging in: ${err}`);
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${APIURL}/api/clients/signup`, userData, {
                headers: {
                    'Authorization': `Bearer ${APIKEY}`,
                    'Content-Type': 'application/json',
                }
            });
            const userToken = response.data;
            setUser(userToken);
            Cookies.set('token', JSON.stringify(userToken), { expires: 7, path: '/' });
            Cookies.set('tokenType', "clients", { expires: 7, path: '/' });
            router.push('/');
        } catch (err) {
            console.error(`Error Logging in: ${err}`);
        }
    };

    const editUserData = async (userId, updatedData) => {
        try {
            const response = await axios.put(`${APIURL}/api/${userType}/${userId}`, updatedData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const updatedUser = response.data;
            setUser(updatedUser);
            Cookies.set('token', JSON.stringify(updatedUser), { expires: 7, path: '/' });
            router.push('/');
        } catch (err) {
            console.error(`Error updating the user data: ${err}`);
        }
    };

    const logout = () => {
        setUser(null);
        Cookies.remove("token", { path: '/' });
        Cookies.remove("tokenType", { path: '/' });
        router.push('/LogIn');
    };

    return (
        <AuthContext.Provider value={{ user, login, login2, register, editUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
