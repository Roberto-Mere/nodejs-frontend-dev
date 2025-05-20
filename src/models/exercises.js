import { db } from '../db/db.js';

export async function getUserExercises(userId) {
  try {
    return await db.all('SELECT * FROM exercises WHERE userId = ?', [userId]);
  } catch (error) {
    throw new Error('Failed to fetch user exercise logs');
  }
}
