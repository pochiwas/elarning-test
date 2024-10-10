import { Request, Response } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import UserCourse from '../models/UserCourse';
import bcrypt from 'bcrypt';

// Crear un usuario
const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json(user);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error });
    return;
  }
};

// Obtener todos los usuarios
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ include: Course });
    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
    return;
  }
};

// Editar un usuario
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await User.findByPk(id);
    if (!user) {
       res.status(404).json({ message: 'Usuario no encontrado' });
       return
    }

    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.role = role;
    await user.save();

    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
    return;
  }
};

// Eliminar un usuario
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
       res.status(404).json({ message: 'Usuario no encontrado' });
       return;
    }

    await user.destroy();
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
    return;
  }
};

export { createUser, getUsers, updateUser, deleteUser };
