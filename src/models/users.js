import { db } from '../db/db.js';

export async function getAllUsers() {
  try {
    return await db.all('SELECT * FROM users', []);
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function findUser(field, value) {
  try {
    return await db.get(`SELECT * FROM users WHERE ${field}  = ?`, [value]);
  } catch (error) {
    throw new Error('Failed to find user');
  }
}

export async function createUser(username) {
  try {
    const result = await db.run('INSERT INTO users (username) VALUES (?)', [
      username,
    ]);

    return { id: result.lastID, username };
  } catch (error) {
    throw new Error('Failed to create user');
  }
}
