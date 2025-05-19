import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/users.js', () => ({
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  findUser: jest.fn(),
}));

let userModel, getUsers, postUser;

const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(async () => {
  jest.resetModules();

  userModel = await import('../models/users.js');
  ({ getUsers, postUser } = await import('../controllers/userController.js'));
});

describe('User controller', () => {
  describe('Get all users', () => {
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

  describe('Create new user', () => {
    it('should return created user and 201 status code', async () => {
      const req = mockReq({ username: 'Rog' });
      const res = mockRes();
      userModel.createUser.mockReturnValue({ id: 1, username: 'Rog' });

      await postUser(req, res);

      expect(userModel.createUser).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'Rog' });
    });

    it('should return 409 status code if username already exists', async () => {
      const req = mockReq({ username: 'Rog' });
      const res = mockRes();
      const error = { error: 'Conflict', message: 'Username already exists' };
      const user = { id: 1, username: 'Rog' };
      userModel.findUser.mockResolvedValue(user);

      await postUser(req, res);

      expect(userModel.findUser).toHaveBeenCalledWith('username', 'Rog');
      expect(userModel.createUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
