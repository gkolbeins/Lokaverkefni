import { Request, Response } from "express";
import {
  createStallion,
  getStallionsByOwner,
  getStallionById,
  updateStallion,
  deleteStallion,
} from "../services/stallionService";
import { isValidIsNumber } from "../utils/isNumber";


export const createStallionController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const { name, is_number, chip_id, notes } = request.body;

    if (!name) {
      return response.status(400).json({ message: "name is required" });
    }

    const stallion = await createStallion({
      name,
      is_number,
      chip_id,
      notes,
      owner_id: userId,
    });

    return response.status(201).json(stallion);
  } catch (error) {
    console.error("Error creating stallion:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const getMyStallions = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;

    const stallions = await getStallionsByOwner(userId);
    return response.status(200).json(stallions);
  } catch (error) {
    console.error("Error fetching stallions:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const getStallionByIdController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    const stallionId = Number(request.params.id);

    if (isNaN(stallionId)) {
      return response.status(400).json({ message: "Invalid stallion id" });
    }

    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;

    const stallion = await getStallionById(stallionId);

    if (!stallion) {
      return response.status(404).json({ message: "Stallion not found" });
    }

    if (stallion.owner_id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    return response.status(200).json(stallion);
  } catch (error) {
    console.error("Error fetching stallion:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const updateStallionController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    const stallionId = Number(request.params.id);

    if (isNaN(stallionId)) {
      return response.status(400).json({ message: "Invalid stallion id" });
    }

    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const stallion = await getStallionById(stallionId);

    if (!stallion) {
      return response.status(404).json({ message: "Stallion not found" });
    }

    if (stallion.owner_id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    const allowedFields = ["name", "is_number", "chip_id", "notes"];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (request.body[field] !== undefined) {
        updates[field] = request.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return response
        .status(400)
        .json({ message: "No valid fields to update" });
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

    const updatedStallion = await updateStallion(stallionId, updates);
    return response.status(200).json(updatedStallion);
  } catch (error) {
    console.error("Error updating stallion:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};


export const deleteStallionController = async (
  request: Request & { user?: { id: number } },
  response: Response
) => {
  try {
    const stallionId = Number(request.params.id);

    if (isNaN(stallionId)) {
      return response.status(400).json({ message: "Invalid stallion id" });
    }

    if (!request.user) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const userId = request.user.id;
    const stallion = await getStallionById(stallionId);

    if (!stallion) {
      return response.status(404).json({ message: "Stallion not found" });
    }

    if (stallion.owner_id !== userId) {
      return response.status(403).json({ message: "Forbidden" });
    }

    const deletedStallion = await deleteStallion(stallionId);

    return response.status(200).json({
      message: "Stallion deleted",
      stallion: deletedStallion,
    });
  } catch (error) {
    console.error("Error deleting stallion:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};