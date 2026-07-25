import mongoose from "mongoose";
import asynchandler from "express-async-handler";
const connected=()=>{

         mongoose.connect(process.env.URI)
        }

export default connected;