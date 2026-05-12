import { Router } from "express";
import { encenderLuz, apagarLuz, getSensores, getSwitches } from "../controllers/homeAssistantController";

import authenticate from '../middlewares/authenticate';

const router = Router();

router.post("/luz/on", authenticate, encenderLuz);
router.post("/luz/off", authenticate, apagarLuz);
router.get("/sensores", authenticate, getSensores);
router.get("/switches", authenticate, getSwitches);

export default router;
