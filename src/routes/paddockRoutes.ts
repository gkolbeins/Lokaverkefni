import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import {   createPaddockController,
  getPaddocksController,
  getPaddockByIdController,
  getPaddockHorsesController,
  updatePaddockController,
  deletePaddockController, } from "../controllers/paddockController";

const router = Router();

router.post("/", authenticateToken, createPaddockController);
router.get("/", authenticateToken, getPaddocksController);
router.get("/:id", authenticateToken, getPaddockByIdController);
router.get("/:id/horses", authenticateToken, getPaddockHorsesController);
router.patch("/:id", authenticateToken, updatePaddockController);
router.delete("/:id", authenticateToken, deletePaddockController);


export default router;
