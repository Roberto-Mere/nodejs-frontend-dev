import { Router } from 'express';
import { getUsers, postUser } from '../controllers/userController.js';
import { validateUser } from '../validators/userValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', getUsers);
router.post('/', validateUser, validateRequest, postUser);

export default router;
