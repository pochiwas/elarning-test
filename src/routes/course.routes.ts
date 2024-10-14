import { Router } from 'express';
import { createCourse, editCourse, deleteCourse, getCourses } from '../controllers/course.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { verifyRole } from '../middlewares/verifyRole.middleware';

const courserouter = Router();

courserouter.post('/createCourse', authMiddleware, verifyRole('admin'), createCourse);
courserouter.put('/updatedCourse/:id', authMiddleware, verifyRole('admin'), editCourse);
courserouter.delete('/deletedCourse/:id', authMiddleware, verifyRole('admin'), deleteCourse);
courserouter.get('/getAllCourse', authMiddleware, getCourses);

export default courserouter;
