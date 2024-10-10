import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Login de usuario
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Comparar la contraseña encriptada
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '4h' }
    );

    res.status(200).json({ token });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
    return;
  }
};

// Registrar un nuevo usuario (opcional si se requiere)
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear un nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
    return;
  }
};
