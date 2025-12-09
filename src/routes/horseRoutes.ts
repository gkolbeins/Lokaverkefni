import { Router } from "express";
import { getAllHorses } from "../controllers/horseController";

const router = Router();

router.get("/", getAllHorses);

export default router;
