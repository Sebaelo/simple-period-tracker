import express from "express";
import { createPeriod } from "../controllers/periodsController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createPeriod);

export default router;
