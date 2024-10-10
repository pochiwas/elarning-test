import express from 'express';

// Extender la interfaz Request para incluir la propiedad user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        role?: string;
      };
    }
  }
}
