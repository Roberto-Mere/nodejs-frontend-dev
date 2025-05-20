import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/exercises.js', () => ({
  getUserExercises: jest.fn(),
}));
jest.unstable_mockModule('../models/users.js', () => ({
  findUser: jest.fn(),
}));

const mockReq = (body, params) => ({ body, params });
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
  ({ getUserLogs } = await import('../controllers/exerciseController.js'));
});

describe('Exercise controller', () => {
  describe('Get all user logs', () => {
    it('should return user object with array of user exercise logs, exercise log count and 200 status code', async () => {
      const req = mockReq({}, { id: 1 });
      const res = mockRes();
      const user = { id: 1, username: 'Rog' };
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
      userModel.findUser.mockReturnValue(user);

      await getUserLogs(req, res);

      expect(exerciseModel.getUserExercises).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...user,
        logs,
        count: logs.length,
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
  });
});
