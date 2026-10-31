import express from "express";
import Verify from "../Middleware/Verify.js";
import { CreateLoan, GetLoans, UpdateLoanPayment } from "../Controllers/loans/Loans.js";

const router = express.Router();

router.route("/loans").get(Verify, GetLoans).post(Verify, CreateLoan);
router.patch("/loans/:id/payment", Verify, UpdateLoanPayment);

export default router;
