import {
  createExercise,
  getUserExerciseCount,
  getUserExercises,
} from '../models/exercises.js';
import asyncHandler from 'express-async-handler';
import { findUser } from '../models/users.js';

export const getUserLogs = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const filters = req.query;
  const user = await findUser('id', userId);

  if (!user) {
    res.status(404).json({ error: 'Not Found', message: 'User not found' });

    return;
  }

  const userLogs = await getUserExercises(userId, filters);
  const count = await getUserExerciseCount(userId, filters);

  res.status(200).json({ ...user, logs: userLogs, count });
});

export const postExercise = asyncHandler(async (req, res) => {
  const userId = +req.params.id;
  const today = new Date(Date.now()).toISOString().slice(0, 10);
  const {
    description,
    duration: enteredDuration,
    date: enteredDate,
  } = req.body;
  const date = enteredDate ? enteredDate : today;
  const duration = +enteredDuration;

  const user = await findUser('id', userId);

  if (!user) {
    res.status(404).json({ error: 'Not Found', message: 'User not found' });

    return;
  }

  const newExerciseId = await createExercise(
    description,
    duration,
    date,
    userId
  );

  res.status(200).json({
    userId,
    exerciseId: newExerciseId,
    description,
    duration,
    date,
  });
});
