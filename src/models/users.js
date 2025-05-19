import { db } from '../db/db.js';

export async function getAllUsers() {
  try {
    return await db.all('SELECT * FROM users', []);
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function createUser(username) {
  try {
    await db.run('INSERT INTO users (username) VALUES (?)', [username]);
  } catch (error) {
    throw new Error('Failed to create user');
  }
}
