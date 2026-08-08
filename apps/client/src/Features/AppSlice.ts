import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface intialstates{
    Toggle:boolean,
    Routes:string,
    Token:string,
    UserDetails:{},
}


interface DecodedToken {
    Role: string;
    Username: string;
    id: string;
}


const initialState:intialstates={
    Toggle:true,
    Routes:'',
    Token:'',
    UserDetails:{}

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
        setToken:(state,action)=>{
            console.log('Setting token in AppSlice:', action.payload);
             state.Token=action.payload
            const token =action.payload
             if(token && typeof token === 'string' && token !== 'null'){
                try {
                    const result=jwtDecode(token)
                    if(result){
                        const {Role,id,Username}:DecodedToken =result?.UserInfo
                        state.UserDetails={Role,id,Username}
                    }
                } catch (err) {
                    console.error('Invalid token:', err);
                    state.Token=''
                }
            }


        },
        SetUserDetails:(state,action)=>{
             state.UserDetails=action.payload

        },
        
    }
 }) 

 
 export const{SetToggle,SetRoutes,setToken,SetUserDetails}=AppSlice.actions 

 export const GetToggle=(state:any)=>state.Appslice?.Toggle
 export const GetToken=(state:any)=>state.Appslice?.Token
 export const GetUserDetails=(state:any)=>state.Appslice?.UserDetails
 export const GetRoutes=(state:any)=>state.Appslice?.Routes
 
  export default AppSlice.reducer
