import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUsers } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware'; // Middleware de autenticación
import { verifyRole } from '../middlewares/verifyRole.middleware'; // Middleware para roles

const userRouter = Router();

userRouter.post('/', authMiddleware, verifyRole('admin'), createUser);
userRouter.put('/:id', authMiddleware, verifyRole('admin'), updateUser);
userRouter.delete('/:id', authMiddleware, verifyRole('admin'), deleteUser);
userRouter.get('/', authMiddleware, verifyRole('admin'), getUsers);

export default userRouter;
