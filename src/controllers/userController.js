import { getAllUsers, createUser, findUser } from '../models/users.js';
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

  const existing = await findUser('username', username);

  if (existing) {
    res
      .status(409)
      .json({ error: 'Conflict', message: 'Username already exists' });

    return;
  }

  const newUser = await createUser(username);

  res.status(201).json(newUser);
});
