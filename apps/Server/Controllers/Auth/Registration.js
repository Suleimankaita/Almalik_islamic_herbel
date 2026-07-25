import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import User from "../../models/User.js";
import asynchanler from "express-async-handler";
import UserProfile from "../../models/UserProfile.js";

const Registration=asynchanler(async(req,res)=>{

    const {Username,Password,FirstName,LastName}=req.body;

    const CheckInput=Checkfields({Username,Password,FirstName,LastName})

    if(!CheckInput.success)return res.status(400).json({message:CheckInput.message});

    const Userfound=await User.findOne({Username}).exec()

    if(Userfound)return res.status(409).json({message:`this user is Already exist ${Username}`})
    
    const Userprofile=await UserProfile.create({
        Password,
    }) 
    
    await User.create({
        Username,FirstName,LastName,
        UserProfile:Userprofile._id
    })
    res.status(200).json({message:`User created ${Username}`})
})

export default Registration;