import jwt from "jsonwebtoken"
import asynchandler from "express-async-handler"
import authCookieOptions from "../../Config/AuthCookie.js";

const RefreshToken=asynchandler(async(req,res)=>{
    const token =req.cookies?.jwt
    if(!token)return res.status(401).json({message:'Refresh token missing'})

        let decode;
        try {
            decode=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token");
        } catch {
            res.clearCookie("jwt", authCookieOptions());
            return res.status(403).json({message:'Invalid refresh token'})
        }
        const {id,Role,Username}=decode?.UserInfo
        
        const accesstoken=jwt.sign({
            UserInfo:{
                id,
                Role,
                Username
            }
        },
        process.env.ACCESS_TOKEN_SECRET || "dev-access-token"
    ,{
        expiresIn:'10m'
    })
        const refreshtoken=jwt.sign({
            UserInfo:{
                id,
                Role,
                Username
            }
        },
        process.env.REFRESH_TOKEN_SECRET || "dev-refresh-token"
    ,{
        expiresIn:'7d'
    })
    res.cookie('jwt',refreshtoken,{
        ...authCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.status(201).json(accesstoken)

})

export default RefreshToken