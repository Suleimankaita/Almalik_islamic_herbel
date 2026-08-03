import express from "express";
import Refresh from "../Controllers/Auth/refreshToken.js";
import Verify from "../Middleware/Verify.js";
const router = express.Router();

router.route('/refresh')
.post(Refresh);

export default router;