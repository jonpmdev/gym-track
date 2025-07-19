import { Router } from 'express';
import { check } from 'express-validator';
import { register, login, getProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  [
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
      .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe contener al menos un carácter especial'),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Por favor incluye un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
  ],
  login
);

// Obtener usuario actual
router.get('/me', auth, getProfile);

export default router; 