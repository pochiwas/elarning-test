import request from 'supertest';
import app from '../server';
import sequelize from '../config/database';
import Course from '../models/Course';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Course API', () => {
  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        name: 'Node.js Course',
        description: 'Comprehensive Node.js course',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Node.js Course');
  });

  it('should get all courses', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should update a course', async () => {
    const course = await Course.findOne({ where: { name: 'Node.js Course' } });
    const res = await request(app)
      .put(`/api/courses/${course?.id}`)
      .send({
        name: 'Updated Node.js Course',
        description: 'Updated description',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Node.js Course');
  });

  it('should delete a course', async () => {
    const course = await Course.findOne({ where: { name: 'Updated Node.js Course' } });
    const res = await request(app).delete(`/api/courses/${course?.id}`);
    expect(res.statusCode).toBe(204);
  });
});
