'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loginToken, setLoginToken] = useState(null);
    const router = useRouter();

    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const APIKEY = process.env.NEXT_PUBLIC_API_KEY;

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(token);
                setUser(decodedToken.client || decodedToken.provider);
                setLoginToken(decodedToken.token);
            } catch (error) {
                Cookies.remove("token");
                console.error('Error parsing token:', error);
            }
        }
        const tokenType = Cookies.get("tokenType");
        if (tokenType) {
            setUserType(tokenType);
        }
    }, []);

    const login = async (userData, role) => {
        try {
            const response = await axios.post(`${APIURL}/api/${role}/login`, userData, {
                headers: {
                    'Authorization': `Bearer ${APIKEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const userToken = response.data;
            setUser(userToken.client || userToken.provider);
            setLoginToken(userToken.token);
            Cookies.set('token', JSON.stringify(userToken), { expires: 7, path: '/' });
            Cookies.set('tokenType', role, { expires: 7, path: '/' });
            router.push('/');
        } catch (err) {
            console.error(`Error logging in: ${err}`);
        }
    };

    const register = async (userData, role) => {
        try {
            const response = await axios.post(`${APIURL}/api/${role}/signup`, userData, {
                headers: {
                    'Authorization': `Bearer ${APIKEY}`,
                    'Content-Type': 'application/json',
                }
            });
            const userToken = response.data;
            setUser(userToken.client || userToken.provider);
            setLoginToken(userToken.token);
            Cookies.set('token', JSON.stringify(userToken), { expires: 7, path: '/' });
            Cookies.set('tokenType', role, { expires: 7, path: '/' });
            router.push('/');
        } catch (err) {
            console.error(`Error registering: ${err}`);
        }
    };

    const editUserData = async (userId, updatedData) => {
        try {
            const response = await axios.put(`${APIURL}/api/${userType}/${userId}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const updatedUser = response.data;
            setUser(updatedUser);
            Cookies.set('token', JSON.stringify({ ...JSON.parse(Cookies.get('token')), client: updatedUser }), { expires: 7, path: '/' });
            router.push('/');
        } catch (err) {
            console.error(`Error updating the user data: ${err}`);
        }
    };

    const logout = () => {
        setUser(null);
        setLoginToken(null);
        setUserType(null);
        Cookies.remove("token", { path: '/' });
        Cookies.remove("tokenType", { path: '/' });
        Cookies.remove('loginToken', { path: '/' });
        router.push('/Login');
    };

    const getClient = async (userId, loginToken) => {
        try {
            const response = await axios.get(`${APIURL}/api/clients/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    };

    return (
        <AuthContext.Provider value={{ loginToken, user, login, register, editUserData, logout, getClient }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
