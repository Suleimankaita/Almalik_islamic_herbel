import User from "../models/User.js";
import asynchandler from "express-async-handler";

const GetAllUser=asynchandler(async(req,res)=>{
    
    const AllUsers=await User.find().populate('UserProfile').lean().exec();
    
    if(!AllUsers.length)return res.status(400).json({message:'Empty Users'});

    res.status(201).json(AllUsers)

})

export default GetAllUser