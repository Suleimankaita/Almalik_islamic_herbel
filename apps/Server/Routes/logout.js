import express from "express"
import LogOut from "../Controllers/Auth/LogOut.js"
import Verify from "../Middleware/Verify.js"
const route=express.Router();

route.route('/')
.post(Verify,LogOut)

export default route