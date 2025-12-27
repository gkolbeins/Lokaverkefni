import { Request, Response } from "express";
import { getHorsesByOwner, getHorseById, updateHorse, deleteHorse } from "../services/horseService";
import { ageFromIsNumber } from "../utils/ageFromIsNumber";
import { isValidIsNumber } from "../utils/isNumber";

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

    if (updates.is_number !== undefined && !isValidIsNumber(updates.is_number)) {
      return response.status(400).json({
        message: "Invalid is_number format. Expected 2 letters followed by 10 digits.",
      });
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

export const getAllHorses = async (request: Request, response: Response) => {
  try {
    if (!request.userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const horses = await getHorsesByOwner(request.userId);

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

export const deleteHorseController = async (
  request: Request,
  response: Response
) => {
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


