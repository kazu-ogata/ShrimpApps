import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';

jest.unstable_mockModule('../models/user.model.js', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: { compare: jest.fn() },
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() },
}));

const { default: app } = await import('../index.js');
const { default: User } = await import('../models/user.model.js');
const { default: bcryptMock } = await import('bcryptjs');
const { default: jwtMock } = await import('jsonwebtoken');

describe('POST /api/auth/login', () => {
  test('should return 404 if user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      loginInput: 'nonexistentUser',
      password: '123456',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  test('should return 200 and token if login is successful', async () => {
    const mockUser = {
      _id: '123',
      username: 'testUser',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    User.findOne.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(true);
    jwtMock.sign.mockReturnValue('mockToken');

    const res = await request(app).post('/api/auth/login').send({
      loginInput: 'testUser',
      password: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBe('mockToken');
    expect(res.body.message).toBe('Login Successful');
  });
});
