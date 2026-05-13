import { Router } from "express";
import { encenderLuz, apagarLuz, getSensores, getSwitches, getCameraStream } from "../controllers/homeAssistantController";

import authenticate from '../middlewares/authenticate';

const router = Router();

router.post("/luz/on", encenderLuz);
router.post("/luz/off", apagarLuz);
router.get("/sensores", getSensores);
router.get("/switches", getSwitches);
router.get("/camera/:entityId", getCameraStream);

export default router;
