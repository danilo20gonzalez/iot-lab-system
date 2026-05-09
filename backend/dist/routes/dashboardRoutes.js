"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get('/dashboard/stats', dashboardController_1.getStats);
router.get('/dashboard/alerts', dashboardController_1.getAlerts);
router.get('/dashboard/activities', dashboardController_1.getRecentActivity);
exports.default = router;
