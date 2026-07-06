import { createClient } from '@supabase/supabase-js';

// Если Vite не подтянул переменные из панели Vercel, берем жестко прописанные строки
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fjaxhiohvkabwlcfwxcs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqYXhoaW9odmthYndsY2Z3eGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NjAzNDEsImV4cCI6MjA5ODUzNjM0MX0.n_T-TFWvgiAo9lTRwUprGT58MN_DwhOzLei4dzd6-uc';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Критическая ошибка: Данные подключения Supabase не найдены!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);