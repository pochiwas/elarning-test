import { Request, Response } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de Sequelize para User
jest.mock('../models/User', () => {
  return {
    __esModule: true,
    default: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn(),
}));

// Mock de jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Controller Tests', () => {
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
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  // Test de inicio de sesión de usuario
  it('debería iniciar sesión exitosamente y devolver un token', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashed_password', role: 'user' };
    
    mockRequest = { body: { email: 'test@example.com', password: 'password123' } };
    
    // Mockear el método findOne de Sequelize
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mockear la comparación de contraseñas de bcrypt
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    // Mockear la generación de JWT
    (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

    await loginUser(mockRequest as Request, mockResponse as Response);
    
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, role: mockUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: '4h' }
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mocked_token' });
  });

  // Test para contraseña incorrecta en login
  it('debería retornar 401 si la contraseña es incorrecta', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashed_password', role: 'user' };
    
    mockRequest = { body: { email: 'test@example.com', password: 'wrong_password' } };
    
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    await loginUser(mockRequest as Request, mockResponse as Response);
    
    expect(bcrypt.compareSync).toHaveBeenCalledWith('wrong_password', 'hashed_password');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Contraseña incorrecta' });
  });

  // Test para usuario no encontrado en login
  it('debería retornar 404 si el usuario no es encontrado', async () => {
    mockRequest = { body: { email: 'nonexistent@example.com', password: 'password123' } };

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(mockRequest as Request, mockResponse as Response);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  // Test para registrar un nuevo usuario
  it('debería registrar un usuario exitosamente', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'hashed_password', role: 'user' };

    mockRequest = { body: { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' } };

    // Mockear la creación del hash de contraseña de bcrypt
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed_password');

    // Mockear el método create de Sequelize
    (User.create as jest.Mock).mockResolvedValue(mockUser);

    await registerUser(mockRequest as Request, mockResponse as Response);

    expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'user',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
  });

  // Test para error en registro de usuario
  it('debería retornar 500 si ocurre un error en el registro', async () => {
    mockRequest = { body: { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' } };

    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed_password');
    (User.create as jest.Mock).mockRejectedValue(new Error('Error al registrar usuario'));

    await registerUser(mockRequest as Request, mockResponse as Response);

    expect(User.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'user',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al registrar usuario',
      error: expect.any(Error),
    });
  });

  it('debería retornar 500 si ocurre un error en el login', async () => {
    // Mock de la solicitud
    mockRequest = { body: { email: 'test@example.com', password: 'password123' } };
  
    // Simular un error al intentar buscar el usuario
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Error al buscar usuario'));
  
    await loginUser(mockRequest as Request, mockResponse as Response);
  
    // Verificar que se devuelve el status 500 y el mensaje de error
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al iniciar sesión',
      error: expect.any(Error)
    });
  });
});
