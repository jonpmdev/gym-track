import dotenv from 'dotenv';

dotenv.config();

// Clave JWT segura y constante para desarrollo
const DEFAULT_JWT_SECRET = 'gym_track_secure_jwt_secret_key_2024';

// Asegurarse de que el JWT_SECRET sea consistente
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
console.log('JWT_SECRET usado:', JWT_SECRET);

export default {
  PORT: process.env.PORT || 5000,
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  SUPABASE_KEY: process.env.SUPABASE_KEY || 'your-supabase-anon-key',
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
}; 