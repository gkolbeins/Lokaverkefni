import { Request, Response } from "express";
import { createPaddock } from "../services/paddockService";
import { getStallionById } from "../services/stallionService";

export const createPaddockController = async (
  request: Request,
  response: Response
) => {
  try {
    if (!request.userId) {return response.status(401).json({ message: "Unauthorized" });}

    const { name, location, stallion_id } = request.body;

    if (!name || !stallion_id) {
      return response
        .status(400)
        .json({ message: "name and stallion_id are required" });
    }

    const stallion = await getStallionById(Number(stallion_id));

    if (!stallion) {return response.status(404).json({ message: "Stallion not found" });}

//bara eigandi graðhests má eiga paddock!!!
    if (stallion.owner_id !== request.userId) {
      return response
        .status(403)
        .json({ message: "Only the stallion owner can create paddocks" });
    }

    const paddock = await createPaddock({
      name,
      location,
      stallion_id,
    });

    return response.status(201).json(paddock);
  } catch (error) {
    console.error("Error creating paddock:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
};
