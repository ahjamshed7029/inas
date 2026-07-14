const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchQuery, profile, direction, lang } = await req.json()

   const agentsApiKey = Deno.env.get('AGENTS_API_KEY')
const serperKey = Deno.env.get('SERPER_API_KEY')

// Если хотя бы одного ключа нет — возвращаем ошибку
if (!agentsApiKey || !serperKey) {
  return new Response(
    JSON.stringify({ 
      error: "Ключи Groq (AGENTS_API_KEY) или Serper (SERPER_API_KEY) не найдены в секретах Supabase!" 
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  )
}
    // 1. Поиск текстовой информации через Serper API
    const searchResponse = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: searchQuery, gl: 'uz', hl: lang || 'uz' }),
    })
    const searchData = await searchResponse.json()
    
    const sourceLinks = searchData.organic?.map((item: any) => item.link).slice(0, 5) || []
    const webContext = searchData.organic?.map((item: any) => `${item.title}: ${item.snippet}`).join('\n') || ""

    // 2. Поиск видео через Serper YouTube Endpoint
    const ytSearchResponse = await fetch('https://google.serper.dev/videos', {
      method: 'POST',
      headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: searchQuery, gl: 'uz', hl: lang || 'uz' }),
    })
    const ytSearchData = await ytSearchResponse.json()
    const youtubeVideos = ytSearchData.videos?.map((video: any) => ({
      title: video.title,
      url: video.link,
      imageUrl: video.imageUrl
    })).slice(0, 3) || []

    // Формируем системные инструкции в зависимости от языка
    let systemPrompt = "You are an expert AI assistant. Answer the user's question clearly based on the provided search context.";
    if (lang === 'ru') {
      systemPrompt = `Ты эксперт-наставник. Отвечай строго на русском языке. Дай развернутый полезный ответ на вопрос пользователя. 
      Учитывай категорию профиля: ${profile || 'Общая'} и направление знаний: ${direction || 'Общее'}. 
      Используй следующий контекст из веб-поиска для точности:\n${webContext}`;
    } else if (lang === 'kk') {
      systemPrompt = `Сіз сарапшы көмекшісіз. Пайдаланушы сұрағына тек қазақ тілінде жауап беріңіз.
      Профиль санатын: ${profile || 'Жалпы'} және бағытты ескеріңіз: ${direction || 'Жалпы'}.
      Дәлдік үшін келесі веб-іздеу мәтінмәнін пайдаланыңыз:\n${webContext}`;
    } else {
      systemPrompt = `Siz ekspert yordamchisiz. Foydalanuvchi savoliga faqat o'zbek tilida javob bering.
      Foydalanuvchi profili: ${profile || 'Umumiy'}, Yo'nalish: ${direction || 'Umumiy'}.
      Aniq ma'lumot berish uchun ushbu qidiruv natijalaridan foydalaning:\n${webContext}`;
    }

    // 3. Запрос к ИИ через независимый OpenAI-совместимый эндпоинт (Hermes 3)
    const providerUrl = 'https://api.groq.com/openai/v1/chat/completions'; 
    
    const aiResponse = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${agentsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'hf:NousResearch/Hermes-3-Llama-3.1-8B', // Наш целевой агент Hermes 3
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: searchQuery }
        ],
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI Provider Error: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json()
    const aiGeneratedText = aiData.choices?.[0]?.message?.content || "Error extracting response from Hermes.";

    // 4. Возвращаем результат на фронтенд
    return new Response(
      JSON.stringify({ aiGeneratedText, sourceLinks, youtubeVideos }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})