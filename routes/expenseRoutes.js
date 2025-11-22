import express from "express";
import { addExpense, getExpensesByGroup } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", addExpense);
router.get("/group/:groupId", getExpensesByGroup);

export default router;
