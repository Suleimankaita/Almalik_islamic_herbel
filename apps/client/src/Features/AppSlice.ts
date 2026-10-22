import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface intialstates{
    Toggle:boolean,
    Routes:string,
    Token:string,
    UserDetails:DecodedToken | null,
}

interface DecodedToken {
    Role: string;
    Username: string;
    id: string;
    UserInfo?: {
        Role: string;
        Username: string;
        id: string;
    };
    exp?: number;
}


const initialState:intialstates={
    Toggle:true,
    Routes:'',
    Token:'',
    UserDetails:null

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
             const token = action.payload;
             if (typeof token !== 'string' || !token || token === 'null') {
                 state.Token = '';
                 state.UserDetails = null;
                 return;
             }

             try {
                 const decoded = jwtDecode<DecodedToken>(token);
                 const user = decoded.UserInfo ?? decoded;
                 if (!user.Role || !user.id) {
                     state.Token = '';
                     state.UserDetails = null;
                     return;
                 }

                 state.Token = token;
                 state.UserDetails = {
                     Role: user.Role,
                     id: user.id,
                     Username: user.Username,
                 };
             } catch {
                 state.Token = '';
                 state.UserDetails = null;
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
