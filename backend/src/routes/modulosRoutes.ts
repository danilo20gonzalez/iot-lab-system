import { Router } from 'express';
import * as modulosController from '../controllers/modulosController';

const router = Router();

router.get('/getModulos/:idlaboratorio', modulosController.getModulos);
router.post('/createModulo', modulosController.createModulo);
router.put('/updateModulo/:id', modulosController.updateModulo);
router.delete('/deleteModulo/:id', modulosController.deleteModulo);

export default router;
