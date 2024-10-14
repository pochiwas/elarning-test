import { Request, Response } from 'express';
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller';
import User from '../models/User';
import Course from '../models/Course';
import bcrypt from 'bcrypt';

// Mocks de Sequelize
jest.mock('../models/User', () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      save: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

jest.mock('../models/Course', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('User Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
      send: jest.fn().mockImplementation(() => {
        responseObject = {};
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  // Test de la creación de un usuario
  it('debería crear un usuario', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashed_password', role: 'user' };
    
    mockRequest = { body: { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' } };
    
    // Mockear la creación del usuario
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    
    await createUser(mockRequest as Request, mockResponse as Response);
    
    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: expect.any(String),
      role: 'user',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  // Test para obtener todos los usuarios
  it('debería obtener todos los usuarios', async () => {
    const mockUsers = [
      { id: 1, name: 'Test User 1', email: 'test1@example.com', role: 'user' },
      { id: 2, name: 'Test User 2', email: 'test2@example.com', role: 'admin' },
    ];
    mockRequest = {};
    // Mockear el método findAll
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
    
    await getUsers(mockRequest as Request, mockResponse as Response);
    
    expect(User.findAll).toHaveBeenCalledWith({ include: Course });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
  });

  // Test para actualizar un usuario
  it('debería actualizar un usuario', async () => {
    const mockUser = {
      id: 1,
      name: 'Old Name',
      email: 'old@example.com',
      password: 'old_password',
      role: 'user',
      save: jest.fn().mockResolvedValue(true),
    };

    mockRequest = {
      params: { id: '1' },
      body: { name: 'New Name', email: 'new@example.com', password: 'new_password', role: 'admin' },
    };

    // Mockear findByPk para encontrar el usuario
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    await updateUser(mockRequest as Request, mockResponse as Response);
    
    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(mockUser.name).toBe('New Name');
    expect(mockUser.email).toBe('new@example.com');
    expect(bcrypt.compareSync('new_password', mockUser.password)).toBe(true);
    expect(mockUser.role).toBe('admin');
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  // Test para eliminar un usuario
  it('debería eliminar un usuario', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', destroy: jest.fn() };

    mockRequest = { params: { id: '1' } };

    // Mockear findByPk para encontrar el usuario
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(mockUser.destroy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  // Test para un usuario no encontrado en la actualización
  it('debería retornar 404 si el usuario no se encuentra en la actualización', async () => {
    mockRequest = { params: { id: '1' }, body: {} };

    // Mockear findByPk para no encontrar el usuario
    (User.findByPk as jest.Mock).mockResolvedValue(null);

    await updateUser(mockRequest as Request, mockResponse as Response);

    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  // Test para un usuario no encontrado en la eliminación
  it('debería retornar 404 si el usuario no se encuentra en la eliminación', async () => {
    mockRequest = { params: { id: '1' } };

    // Mockear findByPk para no encontrar el usuario
    (User.findByPk as jest.Mock).mockResolvedValue(null);

    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('debería retornar 500 si ocurre un error al crear un usuario', async () => {
    mockRequest = { body: { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' } };

    (User.create as jest.Mock).mockRejectedValue(new Error('Error al crear el usuario'));

    await createUser(mockRequest as Request, mockResponse as Response);

    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: expect.any(String),
      role: 'user',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al crear el usuario',
      error: expect.any(Error),
    });
  });

  it('debería retornar 500 si ocurre un error al obtener los usuarios', async () => {
    mockRequest = {};

    (User.findAll as jest.Mock).mockRejectedValue(new Error('Error al obtener los usuarios'));

    await getUsers(mockRequest as Request, mockResponse as Response);

    expect(User.findAll).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al obtener los usuarios',
      error: expect.any(Error),
    });
  });

  it('debería retornar 500 si ocurre un error al actualizar un usuario', async () => {
    mockRequest = { params: { id: '1' }, body: { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' } };

    (User.findByPk as jest.Mock).mockRejectedValue(new Error('Error al actualizar el usuario'));

    await updateUser(mockRequest as Request, mockResponse as Response);

    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al actualizar el usuario',
      error: expect.any(Error),
    });
  });

  it('debería retornar 500 si ocurre un error al eliminar un usuario', async () => {
    mockRequest = { params: { id: '1' } };
  
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', destroy: jest.fn() };
  
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    mockUser.destroy.mockRejectedValue(new Error('Error al eliminar el usuario'));
  
    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(User.findByPk).toHaveBeenCalledWith('1');
    expect(mockUser.destroy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al eliminar el usuario',
      error: expect.any(Error),
    });
  });
});
