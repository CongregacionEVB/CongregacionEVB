import { createClient } from '@supabase/supabase-js';

// Obtenemos las credenciales desde las variables de entorno
const supabaseUrl = "https://tlpypmrdwzyrxssqxflo.supabase.co";
const supabaseKey = "sb_publishable_MjpOXODmam_753-4g6xASg_452qTw7J"

// Inicializamos y exportamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);