import { Router } from "express";
import { encenderLuz, apagarLuz } from "../controllers/sonnofController";

const router = Router();

router.post("/luz/on", encenderLuz);
router.post("/luz/off", apagarLuz);

export default router;
