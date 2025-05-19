import { getAllUsers, createUser } from '../models/users.js';
import asyncHandler from 'express-async-handler';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();

  if (users?.length === 0) {
    res.status(404).json({ error: 'Not Found', message: 'No users found' });
    return;
  }

  res.status(200).json(users);
});

export const postUser = asyncHandler(async (req, res) => {
  const username = req.body.username;

  const newUser = await createUser();

  res.status(201).json(newUser);

  return;
});
