import jwt from "jsonwebtoken"
import asynchandler from "express-async-handler"
import User from "../../models/User.js"
import UserActivity from "../../models/UserActivity.js"
const LogOut =asynchandler(async(req,res)=>{
    const id=req.id
    const UserFound =await User.findById(id).populate("UserProfile")
    if(!UserFound)return res.status(403).json({message:'User Not found'})
    
        const Activityid=await UserActivity.create({
            Username:UserFound.Username,
            ActivtyType:"LogOut"
        })  
        UserFound.UserProfile?.Logs.push(Activityid);
    await UserFound.save()
    
    res.clearCookie('jwt',{  httpOnly: true,
    secure:true,
    sameSite: 'none',})
    
    res.status(201).json({message:'You LogOut Sucessfully '})
    
})

    export default LogOut;