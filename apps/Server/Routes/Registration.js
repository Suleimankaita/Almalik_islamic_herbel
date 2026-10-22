import express from "express";
import Reg from "../Controllers/Auth/Registration.js";
import OptionalVerify from "../Middleware/OptionalVerify.js";

const router = express.Router();

router.route('/Reg')
.post(OptionalVerify, Reg);

export default router;