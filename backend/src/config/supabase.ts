import { createClient } from '@supabase/supabase-js';
import config from './config';

// Crear el cliente de Supabase
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

export default supabase; 