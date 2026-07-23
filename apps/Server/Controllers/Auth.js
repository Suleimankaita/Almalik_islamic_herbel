import Admin from "../../../packages/models/User";
import asynchandler from "express-async-handler"
import Checkfields from "../../../packages/utils/FieldCheck";
import jwt from "jsonwebtoken"

const Login=asynchandler(async(req,res)=>{

    const {Username,Password}=req.body;
    const checklist=Checkfields({Username,Password})
    if(!checklist.success)return res.status(400).json({message:checklist.message})




})

export default Login
