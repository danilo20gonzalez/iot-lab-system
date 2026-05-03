"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeAssistantController_1 = require("../controllers/homeAssistantController");
const router = (0, express_1.Router)();
router.post("/luz/on", homeAssistantController_1.encenderLuz);
router.post("/luz/off", homeAssistantController_1.apagarLuz);
exports.default = router;
