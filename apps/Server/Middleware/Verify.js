import asynchandler from "express-async-handler";
import jwt from "jsonwebtoken"

const Verify=asynchandler(async(req,res,next)=>{
    
    const auth=req.headers['authorization']||req.headers['Authorization']
    if(!auth.startsWith('Bearer '))return res.status(403),json({message:'Invalid Authorized token'});

    const token=auth.split(' ')[1]

    const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const {Username,Roles,id}=decode.UserInfo
    req.Username=Username;
    req.id=id;
    req.Roles=Roles;
    next()

})

export default Verify