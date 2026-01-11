import { Request, Response } from "express";
import { getHorsesByOwner, getHorseById, updateHorse, deleteHorse } from "../services/horseService";
import { ageFromIsNumber } from "../utils/ageFromIsNumber";
import { isValidIsNumber } from "../utils/isNumber";
import { pool } from "../config/db";

export const patchHorse = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    const horseId = Number(request.params.id);

    if (isNaN(horseId)) {
      return response.status(400).json({ message: "Invalid horse id" });
    }

    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const horse = await getHorseById(horseId);

    if (!horse) {
      return response.status(404).json({ message: "Horse not found" });
    }

    if (horse.owner.id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    const allowedFields = [
      "name",
      "is_number",
      "chip_id",
      "notes",
      "needs_vet",
      "scanned",
      "pregnancy_confirmed",
      "other_info_1",
      "other_info_2",
    ];

    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (request.body[field] !== undefined) {
        updates[field] = request.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return response.status(400).json({ message: "No valid fields to update" });
    }

    if (
      updates.is_number !== undefined &&
      !isValidIsNumber(updates.is_number)
    ) {
      return response.status(400).json({
        message:
          "Invalid is_number format. Expected 2 letters followed by 10 digits.",
      });
    }

    const updatedHorse = await updateHorse(horseId, updates);
    return response.status(200).json(updatedHorse);
  } catch (error) {
    console.error("Error updating horse:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const getHorseByIdController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    const horseId = Number(request.params.id);

    if (isNaN(horseId)) {
      return response.status(400).json({ message: "Invalid horse id" });
    }

    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const horse = await getHorseById(horseId);

    if (!horse) {
      return response.status(404).json({ message: "Horse not found" });
    }

    if (horse.owner.id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    return response.status(200).json({
      ...horse,
      age: ageFromIsNumber(horse.is_number),
    });
  } catch (error) {
    console.error("Error fetching horse:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const getAllHorses = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;

    const { paddock, stallion, chip_id, sort } = request.query;

    const options: {
      paddockId?: number;
      stallionId?: number;
      chipId?: string;
      sort?: "name" | "age";
    } = {};

    if (paddock !== undefined) {
      const paddockId = Number(paddock);
      if (!isNaN(paddockId)) {
        options.paddockId = paddockId;
      }
    }

    if (stallion !== undefined) {
      const stallionId = Number(stallion);
      if (!isNaN(stallionId)) {
        options.stallionId = stallionId;
      }
    }

    if (chip_id !== undefined && typeof chip_id === "string") {
      options.chipId = chip_id;
    }

    if (sort === "name" || sort === "age") {
      options.sort = sort;
    }

    const horses = await getHorsesByOwner(userId, options);

    const horsesWithAge = horses.map((horse) => ({
      ...horse,
      age: ageFromIsNumber(horse.is_number),
    }));

    if (sort === "age") {
      horsesWithAge.sort((a, b) => a.age - b.age);
    }

    return response.status(200).json(horsesWithAge);
  } catch (error) {
    console.error("Error fetching horses:", error);
    return response.status(500).json({ message: "Failed to fetch horses" });
  }
};


export const deleteHorseController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    const horseId = Number(request.params.id);

    if (isNaN(horseId)) {
      return response.status(400).json({ message: "Invalid horse id" });
    }

    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const horse = await getHorseById(horseId);

    if (!horse) {
      return response.status(404).json({ message: "Horse not found" });
    }

    if (horse.owner.id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    const deletedHorse = await deleteHorse(horseId);

    return response.status(200).json({
      message: "Horse deleted",
      horse: deletedHorse,
    });
  } catch (error) {
    console.error("Error deleting horse:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const moveHorseController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const horseId = Number(request.params.id);
    const { paddockId, arrival_date } = request.body;

    if (isNaN(horseId) || !paddockId) {
      return response.status(400).json({
        message: "horseId and paddockId are required",
      });
    }

    const horse = await getHorseById(horseId);

    if (!horse) {
      return response.status(404).json({ message: "Horse not found" });
    }

    if (horse.owner.id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
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

    //ef arrival_date er ekki sett með nota ég daginn í dag
    const arrivalDate =
      arrival_date ??
      new Date().toISOString().split("T")[0];

    await pool.query(
      `UPDATE horses
       SET current_paddock_id = $1,
           arrival_date = $2
       WHERE id = $3`,
      [paddockId, arrivalDate, horseId]
    );

    return response.status(200).json({
      message: "Horse moved successfully",
      horseId,
      paddockId,
      arrival_date: arrivalDate,
    });
  } catch (error) {
    console.error("Error moving horse:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


