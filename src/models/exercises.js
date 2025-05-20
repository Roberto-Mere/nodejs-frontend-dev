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
    console.log(error);
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
    console.log(error);
    throw new Error('Failed to fetch user exercise count');
  }
}

export async function createExercise(description, duration, date, userId) {
  try {
    const result = db.run(
      'INSERT INTO exercises (description, duration, date, userId) VALUES (?, ?, ?, ?)',
      [description, duration, date, userId]
    );

    return result.lastID;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create user exercise count');
  }
}
