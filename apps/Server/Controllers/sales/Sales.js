import Checkfields from "../../../../packages/utils/FieldCheck.ts";
import Sales from "../../models/Sales.js";
import User from "../../models/User.js";
import asynchanler from "express-async-handler";
import Product from "../../models/Product.js";

const Sale=asynchanler(async(req,res)=>{
   try{

       const userId=req.id
       const {items}=req.body
        const productids=items.map(item=>item?.id)
       
    const checkinput=Checkfields({userId,productids});

    if(!checkinput.success)return res.status(400).json({message:checkinput.message});

    const userFound = await User.findById(userId).populate({
        path: "UserProfile",
        populate: {
            path: "Sales"
        }
    })

    // Get all products
const productIds = items.map(item => item.id);

const foundProducts = await Product.find({
    _id: { $in: productIds }
});

if (foundProducts.length !== productIds.length) {
    return res.status(404).json({
        message: "One or more products were not found."
    });
}

let total = 0;

// First pass: validate stock
for (const cartItem of items) {

    const product = foundProducts.find(
        p => p._id.toString() === cartItem.id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found."
        });
    }

    if(cartItem.Quantity <= 0){
        return res.status(400).json({
            message: `Quantity for ${product.ProductName} must be greater than zero.`
        });
    }

    if (cartItem.quantity > product.Quantity) {
        return res.status(400).json({
            message: `${product.ProductName} has only ${product.Quantity} item(s) remaining.`
        });
    }
        const sale=await Sales.create({
            ...product,
            User: userFound._id,
            SalePrice:product.SalePrice,
            ActualPrice:product.ActualPrice,
            Quantity:Number(cartItem.quantity)
        })
        
        console.log(sale._id)
        
        userFound.UserProfile?.Sales.push(sale._id)
        
        total += product.SalePrice * cartItem.quantity;

        product.Quantity -= cartItem.quantity;

        await product.save();
    
        await userFound?.UserProfile.save();
}

// Second pass: decrement quantity
// for (const cartItem of items) {

//     const product = foundProducts.find(
//         p => p._id.toString() === cartItem.id
//     );

  
// }
    

    
    res.status(200).json({message:'Sale completed successfully',total})

}catch(e){
    res.status(400).json({message:e.message})
}
})    

export default Sale

