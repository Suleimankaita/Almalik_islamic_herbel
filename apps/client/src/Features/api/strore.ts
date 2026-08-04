import { configureStore } from "@reduxjs/toolkit";
import Appslice from "../AppSlice";
import { a } from "framer-motion/client";
import apiSlice from "./ApiSlice";

export const store:any=configureStore({
    reducer:{
        Appslice,
        [apiSlice.reducerPath]:apiSlice.reducer,
        
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
          serializableCheck: false,
      }).concat(apiSlice.middleware),
})