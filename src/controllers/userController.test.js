import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/users.js', () => ({
  getAllUsers: jest.fn(),
}));

const userModel = await import('../models/users.js');
const { getUsers } = await import('../controllers/userController.js');

const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User controller', () => {
  describe('getUsers', () => {
    it('should return array of users and 200 status code', async () => {
      const req = mockReq({});
      const res = mockRes();
      userModel.getAllUsers.mockReturnValue([
        { id: 1, username: 'Rog' },
        { id: 2, username: 'Yad' },
      ]);

      await getUsers(req, res);

      expect(userModel.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, username: 'Rog' },
        { id: 2, username: 'Yad' },
      ]);
    });

    it('should return 404 status code if no users exist', async () => {
      const req = mockReq({});
      const res = mockRes();
      const error = { error: 'Not Found', message: 'No users found' };
      userModel.getAllUsers.mockReturnValue([]);

      await getUsers(req, res);

      expect(userModel.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
