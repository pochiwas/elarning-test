import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUsers } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware'; // Middleware de autenticación
import { verifyRole } from '../middlewares/verifyRole.middleware'; // Middleware para roles

const userRouter = Router();

userRouter.post('/createUser', authMiddleware, verifyRole('admin'), createUser);
userRouter.put('/updateUser/:id', authMiddleware, verifyRole('admin'), updateUser);
userRouter.delete('/deletedUser/:id', authMiddleware, verifyRole('admin'), deleteUser);
userRouter.get('/getAllUsers', authMiddleware, verifyRole('admin'), getUsers);

export default userRouter;
