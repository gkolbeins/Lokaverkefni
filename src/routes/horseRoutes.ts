import { Router } from "express";
import { pool } from "../config/db";
import { authenticateToken } from "../middleware/authenticateToken";
import * as horseController from "../controllers/horseController";
import { moveHorseController } from "../controllers/horseController";

const router = Router();

router.get("/", authenticateToken, horseController.getAllHorses);

router.get("/:id", authenticateToken, horseController.getHorseByIdController);

router.post("/", authenticateToken, async (request: any, response) => {
  if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { name, is_number, chip_id } = request.body;
  const ownerId = request.user.id;

  if (!name) {
    return response.status(400).json({ message: "name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO horses (name, is_number, chip_id, owner_id, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, is_number, chip_id, ownerId, null]
    );

    return response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", authenticateToken, horseController.patchHorse);

router.delete("/:id", authenticateToken, horseController.deleteHorseController);

router.post("/:id/move", authenticateToken, moveHorseController);

export default router;