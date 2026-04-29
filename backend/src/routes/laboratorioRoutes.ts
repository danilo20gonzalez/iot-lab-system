import { Router } from 'express';
import * as laboratorioController from '../controllers/laboratorioController';

const router = Router();

// ✅ Rutas REST
router.get('/getLaboratorios', laboratorioController.getLaboratorios);
router.post('/createLaboratorio', laboratorioController.createLaboratorio);
router.put('/updateLaboratorio/:id', laboratorioController.updateLaboratorio);
router.delete('/deleteLaboratorio/:id', laboratorioController.deleteLaboratorio);

export default router;
