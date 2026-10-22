import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import User from "../../models/User.js";
import asynchanler from "express-async-handler";
import UserProfile from "../../models/UserProfile.js";

const Registration=asynchanler(async(req,res)=>{

    const {Username,Password,FirstName,LastName,Role}=req.body;

    const CheckInput=Checkfields({Username,Password,FirstName,LastName})

    if(!CheckInput.success)return res.status(400).json({message:CheckInput.message});

    const Userfound=await User.findOne({Username}).exec()
    const existingUser = await User.exists({});
    if(Userfound)return res.status(409).json({message:`this user is Already exist ${Username}`})

    if (existingUser && (!req.id || req.Roles !== "Admin")) {
        return res.status(403).json({
            success: false,
            message: "Only an administrator can create user accounts.",
        });
    }

    const assignedRole = existingUser ? Role : "Admin";
    if (!["Admin", "Manager", "Staff"].includes(assignedRole)) {
        return res.status(400).json({
            success: false,
            message: "Role must be Admin, Manager, or Staff.",
        });
    }

    const userProfile = await UserProfile.create({
        Password,
        Role: assignedRole,
    });

    await User.create({
        Username,
        FirstName,
        LastName,
        UserProfile: userProfile._id,
    });

    res.status(200).json({message:`User created ${Username}`})
})

export default Registration;