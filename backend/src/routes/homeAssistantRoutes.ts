import { Router } from "express";
import { encenderLuz, apagarLuz, getSensores, getSwitches } from "../controllers/homeAssistantController";

const router = Router();

router.post("/luz/on", encenderLuz);
router.post("/luz/off", apagarLuz);
router.get("/sensores", getSensores);
router.get("/switches", getSwitches);

export default router;
