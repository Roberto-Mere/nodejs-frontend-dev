import { db } from '../db/db.js';

export async function getUserExercises(userId, filters) {
  try {
    let query = 'SELECT * FROM exercises WHERE userId = ?';
    const queryParams = [userId];

    if (filters.from) {
      query = `${query} AND date >= ?`;
      queryParams.push(filters.from);
    }
    if (filters.to) {
      query = `${query} AND date <= ?`;
      queryParams.push(filters.to);
    }

    return await db.all(query, queryParams);
  } catch (error) {
    throw new Error('Failed to fetch user exercise logs');
  }
}

// export async function createExercise(userId) {
//   const db = getDb();

//   return await db.run('INSERT INTO exercise (username) VALUES (?)', [username]);
// }
