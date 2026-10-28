import mongoose from "mongoose";

const SalesSchema=new mongoose.Schema({
    ProductName:String,
    SKU:String,
    Barcode:Number,
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
    PaymentMethod:{
        type:String,
        enum:["cash","card","pos"],
        default:"cash"
    },
    Date:{
        type:String,
        default:()=>new Date().toISOString().split('T')[0]
    },
    Time:{
        type:String,
        default:()=>new Date().toLocaleTimeString()
    }
},{
    timestamps:true
})

export default mongoose.model("AlmalikUserSales",SalesSchema)