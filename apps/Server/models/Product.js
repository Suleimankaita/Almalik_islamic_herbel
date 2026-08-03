import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    ProductName:String,
    img:{
        type:String,
        default:''
    },
    Categpry:String,
    Supplier:String,
    Barcode:{
        type:Number,
        default:Math.floor(100000000000 + Math.random() * 900000000000)
    },
    SKU:{
        type:Number,
        default:`Alamlik-${Math.floor(Math.random() * 10) + Math.random().toString(36).slice(2, 6).toUpperCase()}`
    },
    ManufactureDate:{
        type:String,
        default:()=>new Date.toISOString().split('T')[0]
    },
    ExpiryDate:{
        type:String,
        default:()=> new Date.toISOString().split('T')[0]
    },
    Quantity:{
        type:Number,
        default:0
    },
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
        default:()=> new Date().toISOString().split('T')[0]
    },
    Time:{
        type:String,
        default:()=>new Date().toLocaleTimeString()
    }
},{
    timestamps:true
})

export default mongoose.model("AlmalikProduct",ProductSchema)