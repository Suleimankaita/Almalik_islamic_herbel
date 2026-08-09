import express from "express";
import Verify from "../Middleware/Verify.js";
import {
  GetUserSettings,
  UpdateUserSettings,
  ChangeUserPassword,
  DeleteUserAccount,
} from "../Controllers/Auth/UserSettings.js";

const router = express.Router();

router.get("/profile", Verify, GetUserSettings);
router.put("/profile", Verify, UpdateUserSettings);
router.put("/profile/password", Verify, ChangeUserPassword);
router.delete("/profile", Verify, DeleteUserAccount);

export default router;
