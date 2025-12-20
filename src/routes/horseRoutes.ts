import { Router } from "express";
import { pool } from "../config/db";
import { authenticateToken } from "../middleware/authenticateToken";
import * as horseController from "../controllers/horseController";

const router = Router();

router.get("/", authenticateToken, horseController.getAllHorses);

router.get("/:id", authenticateToken, horseController.getHorseByIdController);

router.post("/", authenticateToken, async (request, response) => {
  if (!request.userId) {
  return response.status(401).json({ message: "Unauthorized" });
  }
  const { name, is_number, chip_id, age } = request.body;
  const ownerId = request.userId;

  if (!name) {
    return response.status(400).json({ message: "name is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO horses (name, is_number, chip_id, age, owner_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, is_number, chip_id, age, ownerId]
    );

    return response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", authenticateToken, horseController.patchHorse);

export default router;