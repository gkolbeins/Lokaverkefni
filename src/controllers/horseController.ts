import { Request, Response } from "express";
import { getHorses } from "../services/horseService";

export const getAllHorses = async (req: Request, res: Response) => {
  try {
    const horses = await getHorses();
    res.json(horses);
  } catch (error) {
    console.error("Error fetching horses:", error);
    res.status(500).json({ error: "Failed to fetch horses" });
  }
};
