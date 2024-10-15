import { Request, Response, NextFunction } from 'express';
import jwt,{ JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(403).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      const user = decoded as JwtPayload & { id: string; role: string };
      req.user = { id: user.id, role: user.role };
      next();
    } else {
      res.status(401).json({ message: 'Token inválido' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
