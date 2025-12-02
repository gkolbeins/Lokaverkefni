import { Router } from "express";

const router = Router();

router.get("/", (requst, response) => {
  response.json({ message: "Horses endpoint works" });
});

export default router;
