import mongoose from "mongoose";

const SalesSchema=new mongoose.Schema({
    ProductName:String,
     User:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "AlmalikUser",
        },
  ActualPrice:{
        type:Number,
        default:0
    },
    SalePrice:{
        type:Number,
        default:0
    }, 
    Quantity:Number,
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