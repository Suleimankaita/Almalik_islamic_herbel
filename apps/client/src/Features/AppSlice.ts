import { createSlice } from "@reduxjs/toolkit";

interface intialstates{
    Toggle:boolean,
}

const initialState:intialstates={
    Toggle:true
}

 const AppSlice=createSlice({
    name:"AppSlice",
    initialState,
    reducers:{
         SetToggle:(state,action)=>{
             state.Toggle=action.payload
        }
    }
 }) 

 
 export const{SetToggle}=AppSlice.actions 

 export const GetToggle=(state:any)=>state.Appslice?.Toggle
 
  export default AppSlice.reducer
