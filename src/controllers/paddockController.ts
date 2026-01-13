import { Request, Response } from "express";
import { createPaddock, getPaddocksByOwner } from "../services/paddockService";
import { pool } from "../config/db";

export const createPaddockController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const { name, location } = request.body;

    if (!name) {
      return response.status(400).json({ message: "name is required" });
    }

    const paddock = await createPaddock({
      name,
      location,
      owner_id: userId,
    });

    return response.status(201).json(paddock);
  } catch (error: any) {
    if (error.code === "23505") {
      return response.status(400).json({
        message: "You already have a paddock with this name",
      });
    }

    console.error("Error creating paddock:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const getPaddocksController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const paddocks = await getPaddocksByOwner(request.user.id);
    return response.status(200).json(paddocks);
  } catch (error) {
    console.error("Error fetching paddocks:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const getPaddockHorsesController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const paddockId = Number(request.params.id);
  const userId = request.user.id;

  const paddockResult = await pool.query(
    "SELECT * FROM paddocks WHERE id = $1",
    [paddockId]
  );

  if (paddockResult.rows.length === 0) {
    return response.status(404).json({ message: "Paddock not found" });
  }

  const paddock = paddockResult.rows[0];

  if (paddock.owner_id !== userId) {
    return response.status(403).json({ message: "Forbidden" });
  }

  const horsesResult = await pool.query(
    "SELECT * FROM horses WHERE current_paddock_id = $1",
    [paddockId]
  );

  return response.status(200).json(horsesResult.rows);
};


export const getPaddockByIdController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const paddockId = Number(request.params.id);
  const userId = request.user.id;

  //sækja paddock
  const paddockResult = await pool.query(
    "SELECT * FROM paddocks WHERE id = $1",
    [paddockId]
  );

  if (paddockResult.rows.length === 0) {
    return response.status(404).json({ message: "Paddock not found" });
  }

  const paddock = paddockResult.rows[0];

  if (paddock.owner_id !== userId) {
    return response.status(403).json({ message: "Forbidden" });
  }

  //sækja stallion (ef til)
  let stallion = null;
  if (paddock.stallion_id) {
    const stallionResult = await pool.query(
      "SELECT id, name FROM stallions WHERE id = $1",
      [paddock.stallion_id]
    );
    stallion = stallionResult.rows[0] ?? null;
  }

  //sækja hryssur í paddock
  const horsesResult = await pool.query(
    `
    SELECT id, name, chip_id, arrival_date
    FROM horses
    WHERE current_paddock_id = $1
    ORDER BY arrival_date ASC
    `,
    [paddockId]
  );

  return response.status(200).json({
    id: paddock.id,
    name: paddock.name,
    location: paddock.location,
    stallion,
    horses: horsesResult.rows,
  });
};


export const updatePaddockController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const paddockId = Number(request.params.id);
  const userId = request.user.id;
  const { name, location, stallion_id } = request.body;

  if (!name && !location && stallion_id === undefined) {
    return response.status(400).json({
      error: "No fields provided for update",
    });
  }

  const paddockResult = await pool.query(
    "SELECT * FROM paddocks WHERE id = $1",
    [paddockId]
  );

  if (paddockResult.rows.length === 0) {
    return response.status(404).json({ message: "Paddock not found" });
  }

  const paddock = paddockResult.rows[0];

  if (paddock.owner_id !== userId) {
    return response.status(403).json({ message: "Forbidden" });
  }

  if (stallion_id !== undefined) {
  const stallionRes = await pool.query(
    "SELECT * FROM stallions WHERE id = $1",
    [stallion_id]
  );

  if (stallionRes.rows.length === 0) {
    return response.status(400).json({ message: "Invalid stallion_id" });
  }

  if (stallionRes.rows[0].owner_id !== userId) {
    return response.status(403).json({ message: "Forbidden" });
  }
  }

  //aðeins einn stallion má vera í hverri paddock í einu
  if (
  stallion_id !== undefined &&
  stallion_id !== null &&
  paddock.stallion_id !== null
) {
  return response.status(409).json({
    message: "Paddock already has a stallion",
  });
}

  const updateResult = await pool.query(
  `UPDATE paddocks
    SET
      name = COALESCE($1, name),
      location = COALESCE($2, location),
      stallion_id = COALESCE($3, stallion_id)
    WHERE id = $4
    RETURNING *`,
  [
    name ?? null,
    location ?? null,
    stallion_id ?? null,
    paddockId,
  ]);

  return response.status(200).json(updateResult.rows[0]);
};


export const deletePaddockController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  if (!request.user) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const paddockId = Number(request.params.id);
  const userId = request.user.id;

  const paddockResult = await pool.query(
    "SELECT * FROM paddocks WHERE id = $1",
    [paddockId]
  );

  if (paddockResult.rows.length === 0) {
    return response.status(404).json({ message: "Paddock not found" });
  }

  const paddock = paddockResult.rows[0];

  if (paddock.owner_id !== userId) {
    return response.status(403).json({ message: "Forbidden" });
  }

  const horsesResult = await pool.query(
    "SELECT 1 FROM horses WHERE current_paddock_id = $1 LIMIT 1",
    [paddockId]
  );

  if (horsesResult.rows.length > 0) {
    return response.status(400).json({
      message: "Cannot delete paddock with horses",
    });
  }

  await pool.query("DELETE FROM paddocks WHERE id = $1", [paddockId]);

  return response.status(204).send();
};
