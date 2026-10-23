import express from "express"
import LogOut from "../Controllers/Auth/LogOut.js"
const route=express.Router();

route.route('/')
.post(LogOut)

export default route