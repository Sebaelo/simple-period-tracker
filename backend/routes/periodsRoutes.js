import express from "express";
import {
  createPeriod,
  getPeriods,
  updatePeriod,
} from "../controllers/periodsController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createPeriod);

router.get("/", verifyToken, getPeriods);

router.patch("/:id", verifyToken, updatePeriod);

export default router;
