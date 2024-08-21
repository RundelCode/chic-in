'use client'
import { configureStore } from "@reduxjs/toolkit"
import AuthReducer from './Features/Auth/AuthSlice'

const Store = configureStore({
    reducer:{
        AuthReducer
    }
})

export default Store;

