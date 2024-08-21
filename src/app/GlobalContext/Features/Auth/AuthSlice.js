
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useRouter } from "next/navigation";


const APIURL = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_API_KEY;

export const login = createAsyncThunk(
    "Auth/Login",
    async (data, role) => {
        const response = await axios.post(`${APIURL}/api(${role}/login`, data, {
            headers: {
                'Authorization': `Bearer ${APIKEY}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    }
)

export const register = createAsyncThunk(
    "Auth/Login",
    async () => {
        try{
            
        }catch(err){
            
        }
    }
)

export const logOut = createAsyncThunk(
    "Auth/Logout",
    async () => {
        
    }
)

const initialState = {
    userData: {}
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            console.log("Fetching Data...")
        }),
            builder.addCase(login.fulfilled, (state, action) => {
                state.userData = action.payload;
            })
    }
})


export default AuthSlice.reducer;