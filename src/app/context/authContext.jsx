'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

// const userToken = {
//     id: "12345",
//     name: "Javier Gómez",
//     email: "jgec070702@gmail.com",
//     password: "123dxakjajndoduw2423131",
//     city: "Pereira",
//     address: "Bonanza de la pradera torre 2 apto 806",
//     phone: "3148735894"
// }

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null)
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
                Cookies.remove('token');
            }
        }
        const tokenType = Cookies.get("tokenType");
        if (tokenType === "clients") {
            setUserType(tokenType)
        }
        else if (tokenType === "providers") {
            setUserType(tokenType)
        }
    }, [])

    const getCLient = async (userId) => {
        try {
            const response = await axios.get(`${APIURL}/api/${userType}:${userId}`, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
            return (response.data)
        }
        catch (err) {
            console.error(`Error Getting client: ${err}`)
            return (null)
        }
    }

    const login = async (userData) => {
        try {
            const response = await axios.post(`${APIURL}/api/${userType}/login`, userData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
            const userToken = response.data;
            setUser(userToken)
            Cookies.set('token', JSON.stringify(userToken), { expires: 7 });
            Cookies.set('tokenType', "clients", { expires: 7 });
            router.push('/')
        }
        catch (err) {
            console.error(`Error Loggin in: ${err}`)
        }
    }

    const register = async (userData) => {
        try {
            const response = await axios.post(`${APIURL}/api/${userType}/signup`, userData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
            const userToken = response.data;
            setUser(userToken)
            Cookies.set('token', JSON.stringify(userToken), { expires: 7 });
            Cookies.set('tokenType', "clients", { expires: 7 });
            router.push('/')
        }
        catch (err) {
            console.error(`Error Loggin in: ${err}`)
        }
    }

    const editUserData = async (userId, updatedData) => {
        try {
            const response = await axios.put(`${APIURL}/api/${userType}/:${userId}`, updatedData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
            const updatedUser = response.data;
            setUser(updatedUser);
            Cookies.set('token', JSON.stringify(userToken), { expires: 7 });
            router.push('/')

        }
        catch (err) {
            console.error(`Error updating the user data: ${err}`)
        }
    }

    const logout = async () => {
        try {
            const response = await axios.put(`${APIURL}/api/${userType}/logout`, updatedData, {
                headers: {
                    'Authorization': `${APIKEY}`,
                    'content-type': `aplication/json`
                }
            })
            setUser(null);
            Cookies.remove("token");
            Cookies.remove("tokenType");
            router.push('/LogIn')

        }
        catch (err) {
            console.error(`Error updating the user data: ${err}`)
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, editUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);