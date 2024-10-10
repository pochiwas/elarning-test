import { Request, Response, NextFunction } from 'express';

export const verifyRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction):void => {
    if (req.user?.role !== role) {
       res.status(403).json({ message: 'Acceso denegado' });
       return
    }
    next();
  };
};

// import { Request, Response, NextFunction } from 'express';

// export const verifyRole = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     if (req.user?.role !== role) {
//       res.status(403).json({ message: 'Acceso denegado' });
//       return;
//     }
//     next();
//   };
// };
