import { configureStore } from "@reduxjs/toolkit";
import Appslice from "../AppSlice";

export const store:any=configureStore({
    reducer:{
        Appslice        
    }
})