// Importando Router
import { Router } from 'express';

// Importando el controlador 
import userController from '@server/controllers/userController';

// Creando instancia del Router
const router = new Router();

/* GET users listing. */
router.get('/', userController.index);

export default router;