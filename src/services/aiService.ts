import type { AIContentResponse, UserProfileType, KnowledgeDirectionType } from '../types/ai';

interface FetchAIContentPayload {
  searchQuery: string;
  profile: UserProfileType; // Используем твои строгие типы
  direction: KnowledgeDirectionType; // Используем твои строгие типы
  lang: 'ru' | 'kk' | 'uz';
}

export async function fetchAIContent(payload: FetchAIContentPayload): Promise<AIContentResponse> {
  const { searchQuery, profile, direction, lang } = payload;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase конфигурация (URL/KEY) не найдена в файле .env");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/ai-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      searchQuery,
      profile,
      direction,
      lang
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка Supabase Edge Function (${response.status}): ${errorText}`);
  }

  // TypeScript теперь будет счастлив, так как структура ответа из функции 
  // полностью соответствует твоему интерфейсу AIContentResponse
  const data: AIContentResponse = await response.json();
  return data;
}