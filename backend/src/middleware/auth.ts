import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import userModel from '../models/userModel.prisma'; // Cambiado a la versión de Prisma

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface JwtPayload {
  id: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No autorizado, token no proporcionado' });
    }

    console.log('Token recibido:', token.substring(0, 20) + '...');
    console.log('JWT_SECRET usado:', config.JWT_SECRET.substring(0, 10) + '...');

    try {
      // Verificar el token
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      console.log('Token verificado correctamente, ID de usuario:', decoded.id);
      
      // Buscar el usuario
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      // Añadir el usuario a la solicitud
      req.user = {
        id: user.id
      };
      
      next();
    } catch (jwtError: any) {
      console.error('Error al verificar el token JWT:', jwtError.name, jwtError.message);
      return res.status(401).json({ 
        message: 'No autorizado, token inválido', 
        error: jwtError.message,
        type: jwtError.name
      });
    }
  } catch (error: any) {
    console.error('Error de autenticación:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}; 