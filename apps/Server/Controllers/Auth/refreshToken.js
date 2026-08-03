import jwt from "jsonwebtoken"
import asynchandler from "express-async-handler"

const RefreshToken=asynchandler(async(req,res)=>{
    const token =req.cookies?.jwt
    if(!token)res.status(403).json({message:'No token To Verify'})

        const decode=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);

        const accesstoken=jwt.sign({
            UserInfo:{
                id:decode.id,
                Role:decode.Role
            }
        },
        process.env.ACCESS_TOKEN_SECRET
    ,{
        expiresIn:'10m'
    })
        const refreshtoken=jwt.sign({
            UserInfo:{
                id:decode.id,
                Role:decode.Role
            }
        },
        process.env.REFRESH_TOKEN_SECRET
    ,{
        expiresIn:'7d'
    })
    res.cookie('jwt',refreshtoken,{httpOnly:true,
            httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
})
    res.status(201).json(accesstoken)

})

export default RefreshToken