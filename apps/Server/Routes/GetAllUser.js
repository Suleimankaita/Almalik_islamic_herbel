import express from "express";
import AllUsers from "../Controllers/AllUsers.js";
import Verify from "../Middleware/Verify.js";
import RequireRole from "../Middleware/RequireRole.js";

const router = express.Router();

router.route('/AllUsers')
.get(Verify, RequireRole("Admin"), AllUsers);

export default router;