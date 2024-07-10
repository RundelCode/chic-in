'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

const AuthContext = createContext();

const userToken = {
    id: "12345",
    name: "Javier Gómez",
    email: "jgec070702@gmail.com",
    password: "123dxakjajndoduw2423131",
    city: "Pereira",
    address: "Bonanza de la pradera torre 2 apto 806",
    phone: "3148735894"
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

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
    }, [])

    const login = (userData) => {
        setUser(userToken)
        Cookies.set('token', JSON.stringify(userToken), { expires: 7 });
        router.push('/')
    }

    const register = () => {
        setUser(userToken)
        Cookies.set('token', JSON.stringify(userToken), { expires: 7 });
        router.push('/')
    }

    const editUserData = (userId) => {
        console.log(`Datos del usuario ${userId} editados con exito`)
    }

    const logout = () => {
        setUser(null);
        Cookies.remove("token");
        router.push('/LogIn')
    }

    return (
        <AuthContext.Provider value={{ user, login, register, editUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);