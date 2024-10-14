import { Request, Response } from 'express';
import { createCourse, editCourse, deleteCourse, getCourses } from '../controllers/course.controller';
import Course from '../models/Course';

// Mock de Sequelize para Course
jest.mock('../models/Course', () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findAll: jest.fn(),
    },
  };
});

describe('Course Controller Tests', () => {
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
    jest.clearAllMocks();
  });

  // Test de la creación de un curso
  it('debería crear un curso', async () => {
    const mockCourse = { id: 1, name: 'Course 1', description: 'Description 1' };
    
    mockRequest = { body: { name: 'Course 1', description: 'Description 1' } };
    
    (Course.create as jest.Mock).mockResolvedValue(mockCourse);
    
    await createCourse(mockRequest as Request, mockResponse as Response);
    
    expect(Course.create).toHaveBeenCalledWith({
      name: 'Course 1',
      description: 'Description 1',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCourse);
  });

  // Test para obtener todos los cursos
  it('debería obtener todos los cursos', async () => {
    const mockCourses = [
      { id: 1, name: 'Course 1', description: 'Description 1' },
      { id: 2, name: 'Course 2', description: 'Description 2' },
    ];

    mockRequest = {};

    (Course.findAll as jest.Mock).mockResolvedValue(mockCourses);
    
    await getCourses(mockRequest as Request, mockResponse as Response);
    
    expect(Course.findAll).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCourses);
  });

  // Test para editar un curso
  it('debería editar un curso existente', async () => {
    const mockCourse = {
      id: 1,
      name: 'Course 1',
      description: 'Description 1',
      update: jest.fn().mockResolvedValue(true),
    };

    mockRequest = {
      params: { id: '1' },
      body: { name: 'Updated Course', description: 'Updated Description' },
    };

    (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);

    await editCourse(mockRequest as Request, mockResponse as Response);
    
    expect(Course.findByPk).toHaveBeenCalledWith('1');
    expect(mockCourse.update).toHaveBeenCalledWith({
      name: 'Updated Course',
      description: 'Updated Description',
    });
    expect(mockResponse.json).toHaveBeenCalledWith(mockCourse);
  });

  // Test para eliminar un curso
  it('debería eliminar un curso', async () => {
    const mockCourse = { id: 1, name: 'Course 1', description: 'Description 1', destroy: jest.fn() };

    mockRequest = { params: { id: '1' } };

    (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);

    await deleteCourse(mockRequest as Request, mockResponse as Response);

    expect(Course.findByPk).toHaveBeenCalledWith('1');
    expect(mockCourse.destroy).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Curso eliminado exitosamente' });
  });

  // Test para curso no encontrado en la edición
  it('debería retornar 404 si el curso no se encuentra en la edición', async () => {
    mockRequest = { params: { id: '1' }, body: { name: 'Updated Course', description: 'Updated Description' } };

    (Course.findByPk as jest.Mock).mockResolvedValue(null);

    await editCourse(mockRequest as Request, mockResponse as Response);

    expect(Course.findByPk).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Curso no encontrado' });
  });

  // Test para curso no encontrado en la eliminación
  it('debería retornar 404 si el curso no se encuentra en la eliminación', async () => {
    mockRequest = { params: { id: '1' } };

    (Course.findByPk as jest.Mock).mockResolvedValue(null);

    await deleteCourse(mockRequest as Request, mockResponse as Response);

    expect(Course.findByPk).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Curso no encontrado' });
  });

  // Test para error al actualizar un curso
  it('debería retornar 500 si ocurre un error al actualizar un curso', async () => {
    mockRequest = { params: { id: '1' }, body: { name: 'Updated Course', description: 'Updated Description' } };

    (Course.findByPk as jest.Mock).mockRejectedValue(new Error('Error al buscar el curso'));

    await editCourse(mockRequest as Request, mockResponse as Response);

    expect(Course.findByPk).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al actualizar el curso',
      error: expect.any(Error),
    });
  });

   // Test para error al obtener los cursos
   it('debería retornar 500 si ocurre un error al obtener los cursos', async () => {
    mockRequest = {};

    (Course.findAll as jest.Mock).mockRejectedValue(new Error('Error al obtener los cursos'));

    await getCourses(mockRequest as Request, mockResponse as Response);

    expect(Course.findAll).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al obtener los cursos',
      error: expect.any(Error),
    });
  });

  // Test para error en la creación de un curso
  it('debería retornar 500 si ocurre un error al crear un curso', async () => {
    mockRequest = { body: { name: 'Course 1', description: 'Description 1' } };

    (Course.create as jest.Mock).mockRejectedValue(new Error('Error al crear el curso'));

    await createCourse(mockRequest as Request, mockResponse as Response);

    expect(Course.create).toHaveBeenCalledWith({
      name: 'Course 1',
      description: 'Description 1',
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al crear el curso',
      error: expect.any(Error),
    });
  });

  it('debería retornar 500 si ocurre un error al eliminar un curso', async () => {
    mockRequest = { params: { id: '1' } };
  
    const mockCourse = { id: 1, name: 'Course 1', description: 'Description 1', destroy: jest.fn() };
  
    (Course.findByPk as jest.Mock).mockResolvedValue(mockCourse);
    mockCourse.destroy.mockRejectedValue(new Error('Error al eliminar el curso'));
  
    await deleteCourse(mockRequest as Request, mockResponse as Response);

    expect(Course.findByPk).toHaveBeenCalledWith('1');
    expect(mockCourse.destroy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error al eliminar el curso',
      error: expect.any(Error),
    });
  });
  
});
