import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import Sales from "../../models/Sales.js";
import User from "../../models/User.js";
import asynchanler from "express-async-handler";
import Product from "../../models/Product.js";

const Sale=asynchanler(async(req,res)=>{
    const userId=req.id
    console.log(userId)
    const {productids}=req.body
    
    const checkinput=Checkfields({userId,productids});

    if(!checkinput.success)return res.status(400).json({message:checkinput.message});

    const userFound = await User.findById(userId).populate({
        path: "UserProfile",
        populate: {
            path: "Sales"
        }
    })
    
    for(let i=0;i<productids?.length;i++){
        console.log(productids[i])
    }

    
    if(!foundProduct&&!userFound)return res.status(400).json({message:'Staff and Product is not found'})
    
    if(!userFound)return res.status(400).json({message:'User not found'})
    if(!foundProduct)return res.status(400).json({message:'Product not found'});
    
    
    res.status(200).json({message:'test the api'})

})    

export default Sale

