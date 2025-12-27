import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createPaddockController, getPaddocksController, getPaddockByIdController } from "../controllers/paddockController";

const router = Router();

router.post("/", authenticateToken, createPaddockController);
router.get("/", authenticateToken, getPaddocksController);
router.get("/:id", authenticateToken, getPaddockByIdController);

export default router;
