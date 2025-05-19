import { getAllUsers } from '../models/users.js';
import asyncHandler from 'express-async-handler';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json(users);
});
