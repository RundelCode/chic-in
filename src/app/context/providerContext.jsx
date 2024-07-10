'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

const providerContext = createContext();

const userToken = {
    id: "12345",
    name: "Javier Gómez",
    email: "jgec070702@gmail.com",
    password: "123dxakjajndoduw2423131",
    city: "Pereira",
    address: "Bonanza de la pradera torre 2 apto 806",
    phone: "3148735444"
}

export const ProviderProvider = ({ children }) =>{
    const [provider, setProvider]= useState(null);
    const router = useRouter()

    useEffect(()=>{
        
    }, [])

    const getProvider = (providerId)=>{
        console.log(providerId)
        return(userToken)
    }

    const register = ()=>{
        
    }

    const editUserData = ()=>{

    }

    const logOut = ()=>{
        
    }

    return (
        <providerContext.Provider value={{ provider, getProvider }}>
            {children}
        </providerContext.Provider>
    );
}

export const useProvider = () => useContext(providerContext);