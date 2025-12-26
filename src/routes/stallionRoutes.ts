import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import * as stallionController from "../controllers/stallionController";

const router = Router();

router.post("/", authenticateToken, stallionController.createStallionController);

router.get("/", authenticateToken, stallionController.getMyStallions);

router.get("/:id", authenticateToken, stallionController.getStallionByIdController);

router.patch("/:id", authenticateToken, stallionController.updateStallionController);

router.delete("/:id", authenticateToken, stallionController.deleteStallionController);

export default router;
