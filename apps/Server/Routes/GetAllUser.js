import express from "express";
import AllUsers from "../Controllers/AllUsers.js";

const router = express.Router();

router.route('/AllUsers')
.get(AllUsers);

export default router;