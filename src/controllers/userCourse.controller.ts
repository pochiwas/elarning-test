import { Request, Response } from 'express';
import UserCourse from '../models/UserCourse';
import User from '../models/User';
import Course from '../models/Course';

// Asociar un curso a un usuario
const assignCourseToUser = async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'Usuario o curso no encontrado' });
    }

    await UserCourse.create({ userId, courseId });
    res.status(201).json({ message: 'Curso asignado al usuario correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar el curso', error });
  }
};

// Desasociar un curso de un usuario
const removeCourseFromUser = async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;

  try {
    const association = await UserCourse.findOne({ where: { userId, courseId } });

    if (!association) {
      return res.status(404).json({ message: 'Asociación no encontrada' });
    }

    await association.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la asociación', error });
  }
};

export { assignCourseToUser, removeCourseFromUser };
