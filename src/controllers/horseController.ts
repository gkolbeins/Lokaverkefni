import { Request, Response } from "express";
import { getHorses, getHorseById, updateHorse } from "../services/horseService";
import { ageFromIsNumber } from "../utils/ageFromIsNumber";

export const getAllHorses = async (request: Request, response: Response) => {
  try {
    const horses = await getHorses();

    const horsesWithAge = horses.map((horse) => ({
      ...horse,
      age: ageFromIsNumber(horse.is_number),
    }));

    response.json(horsesWithAge);
  } catch (error) {
    console.error("Error fetching horses:", error);
    response.status(500).json({ error: "Failed to fetch horses" });
  }
};

export const patchHorse = async (request: Request, response: Response) => {
  try {
    const horseId = Number(request.params.id);

    if (isNaN(horseId)) {
      return response.status(400).json({ message: "Invalid horse id" });
    }

    if (!request.userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const horse = await getHorseById(horseId);

    if (!horse) {
      return response.status(404).json({ message: "Horse not found" });
    }

    if (horse.owner_id !== request.userId) {
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

    const updatedHorse = await updateHorse(horseId, updates);

    response.json(updatedHorse);
  } catch (error) {
    console.error("Error updating horse:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const getHorseByIdController = async (request: Request, response: Response) => {
  try {
    const horseId = Number(request.params.id);

    if (isNaN(horseId)) {
      return response.status(400).json({ message: "Invalid horse id" });
    }

    if (!request.userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const horse = await getHorseById(horseId);

    if (!horse) {
      return response.status(404).json({ message: "Horse not found" });
    }

    if (horse.owner_id !== request.userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    response.json({
      ...horse,
      age: ageFromIsNumber(horse.is_number),
    });
  } catch (error) {
    console.error("Error fetching horse:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};


