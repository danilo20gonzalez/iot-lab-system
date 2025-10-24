import { Router } from 'express';
import * as moduloController from '../controllers/laboratoryModuleController';

const router = Router();

// ✅ Rutas REST
router.get('/getModulos', moduloController.getModulos); // Listar todos los módulos
router.get('/getModuloById/:id', moduloController.getModuloById); // Obtener un módulo por ID
router.post('/createModulo', moduloController.createModulo); // Crear un nuevo módulo
router.put('/updateModulo/:id', moduloController.updateModulo); // Actualizar un módulo existente
router.delete('/deleteModulo/:id', moduloController.deleteModulo); // Eliminar un módulo

export default router;
