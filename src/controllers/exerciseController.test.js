import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/exercises.js', () => ({
  getUserExercises: jest.fn(),
  getUserExerciseCount: jest.fn(),
  createExercise: jest.fn(),
}));
jest.unstable_mockModule('../models/users.js', () => ({
  findUser: jest.fn(),
}));

const mockReq = (body, params, query) => ({ body, params, query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

let exerciseModel, userModel, getUserLogs;

beforeEach(async () => {
  jest.resetModules();

  exerciseModel = await import('../models/exercises.js');
  userModel = await import('../models/users.js');
  ({ getUserLogs, postExercise } = await import(
    '../controllers/exerciseController.js'
  ));
});

describe('Exercise controller', () => {
  describe('Get all user logs', () => {
    it('should return user object with array of user exercise logs, exercise log count and 200 status code', async () => {
      const req = mockReq({}, { id: 1 });
      const res = mockRes();
      const user = { id: 1, username: 'Rog' };
      const count = 2;
      const logs = [
        {
          id: 1,
          description: 'First exercise',
          duration: 30,
          date: '2025-05-18',
        },
        {
          id: 2,
          description: 'Second exercise',
          duration: 30,
          date: '2025-05-19',
        },
      ];

      exerciseModel.getUserExercises.mockReturnValue(logs);
      exerciseModel.getUserExerciseCount.mockReturnValue(count);
      userModel.findUser.mockReturnValue(user);

      await getUserLogs(req, res);

      expect(exerciseModel.getUserExercises).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...user,
        logs,
        count,
      });
    });

    it('should return 404 status code if user does not exist', async () => {
      const req = mockReq({}, { id: 2 });
      const res = mockRes();
      const user = undefined;
      const error = { error: 'Not Found', message: 'User not found' };
      userModel.findUser.mockReturnValue(user);

      await getUserLogs(req, res);

      expect(exerciseModel.getUserExercises).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(error);
    });

    it('should filter logs based on date using from and to query params', async () => {
      const req = mockReq(
        {},
        { id: 1 },
        { from: '2025-01-01', to: '2026-01-01' }
      );
      const res = mockRes();
      const user = { id: 1, username: 'Rog' };
      userModel.findUser.mockReturnValue(user);

      await getUserLogs(req, res);

      expect(exerciseModel.getUserExercises).toHaveBeenCalledWith(user.id, {
        from: '2025-01-01',
        to: '2026-01-01',
      });
    });

    it('should filter logs based on date using from and to query params', async () => {
      const req = mockReq({}, { id: 1 }, { limit: 5 });
      const res = mockRes();
      const user = { id: 1, username: 'Rog' };
      userModel.findUser.mockReturnValue(user);

      await getUserLogs(req, res);

      expect(exerciseModel.getUserExercises).toHaveBeenCalledWith(user.id, {
        limit: 5,
      });
    });
  });

  describe('Create user exercise', () => {
    it('should return created exercise objcet and 200 status code', async () => {
      const userId = 1;
      const exerciseId = 1;
      const exerciseData = {
        description: 'First exercise',
        duration: 30,
        date: '2025-01-01',
      };
      const req = mockReq(exerciseData, { id: userId });
      const res = mockRes();

      exerciseModel.createExercise.mockReturnValue(exerciseId);

      await postExercise(req, res);

      expect(exerciseModel.createExercise).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        userId,
        exerciseId,
        ...exerciseData,
      });
    });
  });
});
