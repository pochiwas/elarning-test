import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';

const authRoutes = Router();

authRoutes.post('/login', loginUser);
authRoutes.post('/register', registerUser); // opcional, si se permite el registro de usuarios

export default authRoutes;
