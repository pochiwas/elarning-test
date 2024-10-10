import { Request, Response } from 'express';
import Course from '../models/Course';

// Crear un nuevo curso (solo accesible por admin)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const newCourse = await Course.create({ name, description });
    res.status(201).json(newCourse);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso', error });
    return;
  }
};

// Editar un curso existente
export const editCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    await course.update({ name, description });
    res.json(course);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso', error });
    return;
  }
};

// Eliminar un curso existente
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).json({ message: 'Curso no encontrado' });
      return;
    }

    await course.destroy();
    res.json({ message: 'Curso eliminado exitosamente' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso', error });
    return;
  }
};

// Listar todos los cursos
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos', error });
    return;
  }
};
