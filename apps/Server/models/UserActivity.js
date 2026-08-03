import mongoose from "mongoose";

const UserActivity=new mongoose.Schema({
    Username:String,
    Date:{
        type:String,
        default:new Date().toISOString().split('T')[0]
    },
    Time:{
        type:String,
        default:new Date().toLocaleTimeString()
    },
    ItemId:[{
        type:mongoose.Types.ObjectId,
        ref:'AlmalikProduct'
    }],
    ActivtyType:{
     type:String,
     enum:['Login','LogOut','Sale','UpdateProduct',]  
    }
},{
    timestamps:true
})

export default mongoose.model('AlmalikUserLogs',UserActivity)