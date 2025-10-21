import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';

jest.unstable_mockModule('../models/user.model.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
  default: { hash: jest.fn() },
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() },
}));

const { default: app } = await import('../index.js');
const { default: User } = await import('../models/user.model.js');
const { default: bcryptMock } = await import('bcryptjs');
const { default: jwtMock } = await import('jsonwebtoken');

describe('POST /api/auth/signup', () => {
  test('should return 400 if fields are missing', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.statusCode).toBe(400);
  });

  test('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ username: 'existingUser' });
    const res = await request(app).post('/api/auth/signup').send({
      username: 'existingUser',
      email: 'test@example.com',
      password: '123456',
    });
    expect(res.statusCode).toBe(400);
  });

  test('should create user and return token', async () => {
    User.findOne.mockResolvedValue(null);
    bcryptMock.hash.mockResolvedValue('hashedPass');
    User.create.mockResolvedValue({ _id: '123', username: 'newUser' });
    jwtMock.sign.mockReturnValue('mockToken');

    const res = await request(app).post('/api/auth/signup').send({
      username: 'newUser',
      email: 'test@example.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBe('mockToken');
  });

  test('should handle server errors gracefully', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));
    const res = await request(app).post('/api/auth/signup').send({
      username: 'abc',
      email: 'abc@example.com',
      password: '123456',
    });
    expect(res.statusCode).toBe(500);
  });
});
