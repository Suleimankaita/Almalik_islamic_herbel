import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import User from "../../models/User.js";
import asynchanler from "express-async-handler";
import UserProfile from "../../models/UserProfile.js";

const Registration=asynchanler(async(req,res)=>{

    const {Username,Password,FirstName,LastName,Role}=req.body;

    const CheckInput=Checkfields({Username,Password,FirstName,LastName})

    if(!CheckInput.success)return res.status(400).json({message:CheckInput.message});

    const Userfound=await User.findOne({Username}).exec()
    const Chck=await User.find().exec()
    if(Userfound)return res.status(409).json({message:`this user is Already exist ${Username}`})
    
    if(Chck.length){

        const Userprofile=await UserProfile.create({
            Password,
            Role
        }) 
        
        await User.create({
            Username,FirstName,LastName,
            UserProfile:Userprofile._id
        })
    }else{
        
        const Userprofile=await UserProfile.create({
            Password,
            Role:"Admin"
        }) 
        
        await User.create({
            Username,FirstName,LastName,
            UserProfile:Userprofile._id
        })
    }
    res.status(200).json({message:`User created ${Username}`})
})

export default Registration;