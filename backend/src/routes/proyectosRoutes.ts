import { Router } from 'express';
import * as proyectosController from '../controllers/proyectosController';

const router = Router();

router.get('/getProyectos/:idproyecto', proyectosController.getProyectos);
router.post('/createProyecto', proyectosController.createProyecto);
router.put('/updateProyecto/:id', proyectosController.updateProyecto);
router.delete('/deleteProyecto/:id', proyectosController.deleteProyecto);

export default router;
