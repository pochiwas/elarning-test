import bcrypt from 'bcrypt';
import User from '../models/User';
import Course from '../models/Course';
import UserCourse from '../models/UserCourse';

const seedDatabase = async () => {
  await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
  });

  await User.create({
    name: 'Student User',
    email: 'student@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'alumno',
  });

  const course1 = await Course.create({ name: 'Curso 1', description: 'Descripción del curso 1' });
  const course2 = await Course.create({ name: 'Curso 2', description: 'Descripción del curso 2' });

  const student = await User.findOne({ where: { email: 'student@example.com' } });
  
  await UserCourse.create({ userId: student?.id!, courseId: course1.id });
  await UserCourse.create({ userId: student?.id!, courseId: course2.id });
};

seedDatabase();
