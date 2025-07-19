import supabase from '../config/supabase';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  try {
    console.log('Inicializando base de datos PostgreSQL en Supabase...');

    // Conexión directa a PostgreSQL para ejecutar comandos SQL
    const pool = new Pool({
      connectionString: process.env.SUPABASE_POSTGRES_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    
    try {
      // Crear tabla de usuarios
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) DEFAULT '',
          weight NUMERIC DEFAULT 0,
          height NUMERIC DEFAULT 0,
          measurements JSONB DEFAULT '{"chest": 0, "waist": 0, "hips": 0, "biceps": 0, "thighs": 0}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabla users creada o ya existente');

      // Crear tabla de entrenamientos
      await client.query(`
        CREATE TABLE IF NOT EXISTS workouts (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          exercises JSONB NOT NULL,
          notes TEXT DEFAULT '',
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabla workouts creada o ya existente');

      // Crear tabla de progreso
      await client.query(`
        CREATE TABLE IF NOT EXISTS progress (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          weight NUMERIC NOT NULL,
          measurements JSONB DEFAULT '{"chest": 0, "waist": 0, "hips": 0, "biceps": 0, "thighs": 0}',
          notes TEXT DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Tabla progress creada o ya existente');

      // Crear índices para mejorar el rendimiento
      await client.query(`CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_progress_date ON progress(date);`);
      console.log('Índices creados o ya existentes');

      // Crear funciones para actualizar automáticamente updated_at
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);
      console.log('Función update_updated_at_column creada');

      // Crear triggers para actualizar automáticamente updated_at
      await client.query(`
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
        CREATE TRIGGER update_workouts_updated_at
        BEFORE UPDATE ON workouts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;
        CREATE TRIGGER update_progress_updated_at
        BEFORE UPDATE ON progress
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('Triggers para updated_at creados');

      console.log('Base de datos inicializada correctamente');
    } finally {
      client.release();
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

initializeDatabase(); 