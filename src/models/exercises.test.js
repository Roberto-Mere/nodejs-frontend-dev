import { jest } from '@jest/globals';

jest.unstable_mockModule('../db/db.js', () => ({
  db: { all: jest.fn() },
}));

let db;

beforeEach(async () => {
  jest.resetModules();

  ({ db } = await import('../db/db.js'));
  ({ getUserExercises } = await import('../models/exercises.js'));
});

describe('Exercise model', () => {
  describe('Get user exercises', () => {
    it('should order logs by date asc when from query param is passed', async () => {
      const userId = 1;
      const filters = { from: '2025-01-01' };

      await getUserExercises(userId, filters);

      expect(db.all).toHaveBeenCalledWith(
        'SELECT * FROM exercises WHERE userId = ? AND date >= ? ORDER BY date',
        [userId, filters.from]
      );
    });

    it('should construct query based on filters passed', async () => {
      const userId = 1;
      let filters = { from: '2025-01-01', to: '2026-01-01', limit: 5 };

      await getUserExercises(userId, filters);

      expect(db.all).toHaveBeenCalledWith(
        'SELECT * FROM exercises WHERE userId = ? AND date >= ? AND date <= ? ORDER BY date LIMIT ?',
        [userId, filters.from, filters.to, filters.limit]
      );

      filters = {};

      await getUserExercises(userId, filters);

      expect(db.all).toHaveBeenCalledWith(
        'SELECT * FROM exercises WHERE userId = ?',
        [userId, filters.from, filters.to, filters.limit]
      );
    });
  });
});
