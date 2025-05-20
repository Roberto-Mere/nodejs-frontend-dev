import { getUserExercises } from '../models/exercises.js';
import asyncHandler from 'express-async-handler';
import { findUser } from '../models/users.js';

export const getUserLogs = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await findUser('id', userId);

  if (!user) {
    res.status(404).json({ error: 'Not Found', message: 'User not found' });

    return;
  }

  const userLogs = await getUserExercises(userId);

  res.status(200).json({ ...user, logs: userLogs, count: userLogs.length });
});
