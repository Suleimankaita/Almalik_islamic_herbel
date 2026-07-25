import express from "express";
import Login from "../Controllers/Auth/Auth.js";

const router = express.Router();

router.route('/login')
.post( Login);

export default router;