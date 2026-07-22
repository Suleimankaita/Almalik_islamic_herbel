import { createSlice } from "@reduxjs/toolkit";

interface intialstates{
    Toggle:boolean,
    Routes:string
}

const initialState:intialstates={
    Toggle:true,
    Routes:''

}

 const AppSlice=createSlice({
    name:"AppSlice",
    initialState,
    reducers:{
         SetToggle:(state,action)=>{
             state.Toggle=action.payload
        },
         SetRoutes:(state,action)=>{
             state.Routes=action.payload
        },
        
    }
 }) 

 
 export const{SetToggle,SetRoutes}=AppSlice.actions 

 export const GetToggle=(state:any)=>state.Appslice?.Toggle
 export const GetRoutes=(state:any)=>state.Appslice?.Routes
 
  export default AppSlice.reducer
