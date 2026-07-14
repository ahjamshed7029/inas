import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase URL или ANON KEY отсутствуют в переменных окружения!');
    throw new Error('Отсутствуют обязательные переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY');
}

console.log('✅ Supabase конфигурация загружена');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);