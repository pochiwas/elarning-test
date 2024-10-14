import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}
// export const verifyRole = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction):void => {
//     if (req.user?.role !== role) {
//        res.status(403).json({ message: 'Acceso denegado' });
//        return
//     }
//     next();
//   };
// };

export const verifyRole = (role: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
       res.status(403).json({ message: 'No está autenticado' });
       return
      }

    if (req.user.role !== role) {
       res.status(403).json({ message: 'No tiene permisos' });
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
