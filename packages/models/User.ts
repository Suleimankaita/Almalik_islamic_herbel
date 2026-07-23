import mongoose from "mongoose";

const Userschema=new mongoose.Schema({
    FirtsName:String,
    LastName:String,
    UserProfile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    }
},{
    timestamps:true
})

export default mongoose.model("AlmalikUserProfile",Userschema)