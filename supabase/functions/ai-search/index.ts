// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, targetLang } = await req.json()

    if (!query || !targetLang) {
      return new Response(JSON.stringify({ error: 'Запрос и язык обязательны' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Ищем в кэше
    const { data: cachedData } = await supabaseAdmin
      .from('search_cache')
      .select('*')
      .eq('query_text', query.toLowerCase().trim())
      .eq('language', targetLang)

    if (cachedData && cachedData.length > 0) {
      return new Response(JSON.stringify({ results: cachedData, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Поиск видео через YouTube API напрямую
    const youtubeKey = Deno.env.get('YOUTUBE_API_KEY')
    let videoResults = []

    if (youtubeKey) {
      try {
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=3&type=video&key=${youtubeKey}`
        const ytRes = await fetch(ytUrl)
        const ytData = await ytRes.json()

        videoResults = (ytData.items || []).map((item: any) => ({
          query_text: query.toLowerCase().trim(),
          content_type: 'videos',
          language: targetLang,
          title: item.snippet.title,
          description: item.snippet.description,
          source_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          preview_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || ''
        }))
      } catch (e) {
        console.error('Ошибка поиска YouTube:', e)
      }
    }

    // Временная заглушка для статей, пока не подключишь Serper API
    const textResults = [
      {
        query_text: query.toLowerCase().trim(),
        content_type: 'articles',
        language: targetLang,
        title: `Рекомендации по вашему запросу (${targetLang.toUpperCase()})`,
        description: `ИИ обработал ваш запрос: "${query}". В данный момент идет наполнение базы статей по этой теме.`,
        source_url: 'https://google.com',
        preview_url: null
      }
    ]

    const allResults = [...textResults, ...videoResults]

    // 3. Запись в кэш
    if (allResults.length > 0) {
      await supabaseAdmin.from('search_cache').insert(allResults)
    }

    return new Response(JSON.stringify({ results: allResults, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})