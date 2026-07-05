import express from "express";
import { protect } from "../middleware/auth.js";
import { createRule, getRule } from "../controllers/ruleController.js";

const router = express.Router();

router.post("/", protect, createRule);

router.get("/", protect, getRule);

export default router;