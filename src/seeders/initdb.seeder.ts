import bcrypt from 'bcrypt';
import User from '../models/User';
import Course from '../models/Course';
import UserCourse from '../models/UserCourse';

export const seedDatabase = async () => {
  // Crear usuarios solo si no existen
  const [adminUser, createdAdmin] = await User.findOrCreate({
    where: { email: 'admin@example.com' },
    defaults: {
      name: 'Admin User',
      password: bcrypt.hashSync('password123', 10),
      role: 'admin',
    }
  });

  const [studentUser, createdStudent] = await User.findOrCreate({
    where: { email: 'student@example.com' },
    defaults: {
      name: 'Student User',
      password: bcrypt.hashSync('password123', 10),
      role: 'alumno',
    }
  });

  // Crear cursos solo si no existen
  const [course1, createdCourse1] = await Course.findOrCreate({
    where: { name: 'Curso 1' },
    defaults: { description: 'Descripción del curso 1' }
  });

  const [course2, createdCourse2] = await Course.findOrCreate({
    where: { name: 'Curso 2' },
    defaults: { description: 'Descripción del curso 2' }
  });

  // Asignar cursos al estudiante solo si la asignación no existe
  await UserCourse.findOrCreate({
    where: { userId: studentUser.id, courseId: course1.id }
  });

  await UserCourse.findOrCreate({
    where: { userId: studentUser.id, courseId: course2.id }
  });
};

seedDatabase();
