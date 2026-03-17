import { Router } from 'express';
import * as userController from '../controllers/userController';
import authenticate from '../middlewares/authenticate';
import { authorizeAdmin } from '../middlewares/authorizeAdmin';


const router = Router();

router.get('/users', userController.getUsers); // Obtener todos los usuarios
router.delete('/users/:id', authenticate, authorizeAdmin, userController.deleteUser); // Eliminar un usuario
router.put('/users/:id', authenticate, authorizeAdmin, userController.updateUser); // Editar un usuario

export default router;