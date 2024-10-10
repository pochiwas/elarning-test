import { Router } from 'express';
import { createCourse, editCourse, deleteCourse, getCourses } from '../controllers/course.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/verifyRole.middleware';

const courserouter = Router();

courserouter.post('/', authMiddleware, verifyRole('admin'), createCourse);
courserouter.put('/:id', authMiddleware, verifyRole('admin'), editCourse);
courserouter.delete('/:id', authMiddleware, verifyRole('admin'), deleteCourse);
courserouter.get('/', authMiddleware, getCourses);

export default courserouter;
