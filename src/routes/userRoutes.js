import { Router } from 'express';
import { getUsers, postUser } from '../controllers/userController.js';
import {
  getUserLogs,
  postExercise,
} from '../controllers/exerciseController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { validateUser } from '../validators/userValidator.js';
import { validateExercise } from '../validators/exerciseValidator.js';
import { validateLogs } from '../validators/logsValidator.js';

const router = Router();

router.get('/', getUsers);
router.post('/', validateUser, validateRequest, postUser);
router.get('/:id/logs', validateLogs, validateRequest, getUserLogs);
router.post('/:id/exercise', validateExercise, validateRequest, postExercise);

export default router;
