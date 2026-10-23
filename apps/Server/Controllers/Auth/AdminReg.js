import User from "../../models/User.js";
import UserProfile from "../../models/UserProfile.js";
import AsyncHandler from "express-async-handler";
 

const AdminRegistration = AsyncHandler(async (req, res,next) => {
    const Users=await User.find().exec();
    if(Users.length)return next();
    
    const profile=await UserProfile.create({
        Password:"Admin",
        Role:"Admin"
    })
    const UserAdd=await User.create({
        FirtsName:"Abdulmalik",
        LastName:"Abdullahi",
        Username:"Admin",
        UserProfile:profile._id
    });
    
    next();

})

export default AdminRegistration;