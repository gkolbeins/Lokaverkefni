import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { createPaddockController } from "../controllers/paddockController";

const router = Router();

router.post("/", authenticateToken, createPaddockController);

export default router;
