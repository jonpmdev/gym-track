import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config';
import userModel from '../models/userModel.prisma'; // Cambiado a la versión de Prisma
import { IUser } from '../types/models';

// Extender la interfaz Request para incluir el usuario autenticado
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = await userModel.create({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Responder con el usuario creado (sin la contraseña)
    const { password: _, ...userWithoutPassword } = newUser as IUser;
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token
    });
  } catch (error: any) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Responder con el usuario (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // El middleware de autenticación ya verificó el token y añadió el userId
    const userId = req.user?.id;
    
    console.log('getProfile - ID de usuario:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Buscar usuario por ID
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con el usuario (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('getProfile - Usuario encontrado:', userWithoutPassword);
    
    res.status(200).json({
      user: userWithoutPassword
    });
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}; 