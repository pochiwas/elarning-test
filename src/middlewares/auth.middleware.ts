import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Verificar si el token decodificado es un objeto que contiene las propiedades esperadas
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      // Hacer el cast de decoded como un JwtPayload con id y role
      const user = decoded as JwtPayload & { id: string; role: string };
      // Asignar user.id y user.role a req.user
      req.user = { id: user.id, role: user.role };
      next();
    } else {
      res.status(401).send({ message: "Token inválido" });
      return;
    }
  } catch (err) {
    res.status(401).send({ message: "Token inválido" });
    return;
  }

  // jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: 'Token inválido' });
  //   }

  //   req.user = decoded;
  //   next();
  // });
};

export default authMiddleware;
