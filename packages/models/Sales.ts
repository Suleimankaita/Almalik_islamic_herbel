import mongoose from "mongoose";

const SalesSchema=new mongoose.Schema({
    ProductName:String,
    ActualPrice:{
        type:Number,
        default:0
    },
    SalePrice:{
        type:Number,
        default:0
    }, 
    Date:{
        type:String,
        default:new Date().toISOString().split('T')[0]
    },
    Time:{
        type:String,
        default:new Date().toLocaleTimeString()
    }
},{
    timestamps:true
})

export default mongoose.model("AlmalikUserSales",SalesSchema)