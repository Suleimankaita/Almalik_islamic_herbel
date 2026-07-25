import express from "express";
import Reg from "../Controllers/Auth/Registration.js";

const router = express.Router();

router.route('/Reg')
.post(Reg);

export default router;