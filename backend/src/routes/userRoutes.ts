import { Router } from 'express';
import * as userController from '../controllers/userController';


const router = Router();

router.post('/userCreate', userController.createUser);
router.get('/getUsers', userController.getUsers);

export default router;