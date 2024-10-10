import request from 'supertest';
import app from '../server';
import sequelize from '../config/database';
import User from '../models/User';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('User API', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'alumno',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('john@example.com');
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should update a user', async () => {
    const user = await User.findOne({ where: { email: 'john@example.com' } });
    const res = await request(app)
      .put(`/api/users/${user?.id}`)
      .send({
        name: 'John Updated',
        email: 'john_updated@example.com',
        password: 'newpassword123',
        role: 'alumno',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('John Updated');
  });

  it('should delete a user', async () => {
    const user = await User.findOne({ where: { email: 'john_updated@example.com' } });
    const res = await request(app).delete(`/api/users/${user?.id}`);
    expect(res.statusCode).toBe(204);
  });
});
