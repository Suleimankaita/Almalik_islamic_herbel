import mongoose from "mongoose";

const UserProfile=new mongoose.Schema({
    Password:String,
    Username:{
        type:String,
        unique:true
    },
    img:String,
    Role:{
        enum:['Admin','Manager','Staff'],
        type:String,
        default:'Staff'
    },
    Sales:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AlmalikUserSales"
    }],
    
    Logs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AlmalikUserLogs"
    }],

    
    
},{
    timestamps:true
})

export default mongoose.model("AlmalikUserProfiles",UserProfile);