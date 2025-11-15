import { Router } from 'express';
import * as laboratorioController from '../controllers/laboratorioController';

const router = Router();

// ✅ Rutas REST
router.get('/getLaboratorios', laboratorioController.getLaboratorios);
router.post('/createLaboratorio', laboratorioController.createLaboratorio);

export default router;
