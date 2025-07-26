import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export class ValidationService {
  /**
   * Ejecuta las validaciones y devuelve errores si existen
   */
  static validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Ejecutar todas las validaciones
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Verificar si hay errores
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      // Devolver errores de validación
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    };
  };

  /**
   * Valida que un campo booleano tenga un valor booleano
   */
  static validateBoolean = (value: any): boolean => {
    return typeof value === 'boolean';
  };
} 