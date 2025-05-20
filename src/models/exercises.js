import { db } from '../db/db.js';

export async function getUserExercises(userId, filters) {
  try {
    const queryParams = [userId];
    const clauses = { where: ['userId = ?'], limit: '', orderBy: '' };

    if (filters.from) {
      clauses.where.push('date >= ?');
      clauses.orderBy = ' ORDER BY date';
      queryParams.push(filters.from);
    }
    if (filters.to) {
      clauses.where.push('date <= ?');
      queryParams.push(filters.to);
    }
    if (filters.limit) {
      clauses.limit = ' LIMIT ?';
      queryParams.push(filters.limit);
    }

    const query = `SELECT * FROM exercises WHERE ${clauses.where.join(
      ' AND '
    )}${clauses.orderBy}${clauses.limit}`;

    return await db.all(query, queryParams);
  } catch (error) {
    throw new Error('Failed to fetch user exercise logs');
  }
}

export async function getUserExerciseCount(userId) {
  try {
    return await db.get(
      'SELECT COUNT(*) AS count FROM exercises WHERE userId = ?',
      userId
    );
  } catch (error) {
    throw new Error('Failed to fetch user exercise count');
  }
}

// export async function createExercise(userId) {
//   const db = getDb();

//   return await db.run('INSERT INTO exercise (username) VALUES (?)', [username]);
// }
