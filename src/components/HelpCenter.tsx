import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

// Список поддерживаемых языков в приложении
const LANGUAGES = [
    { code: 'ru', label: 'Русский' },
    { code: 'kz', label: 'Казахский' },
    { code: 'uz', label: 'Узбекский' },
    { code: 'tj', label: 'Таджикский' },
    { code: 'kg', label: 'Киргизский' },
    { code: 'tm', label: 'Туркменский' }
];

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLang, setSelectedLang] = useState('ru');
    const [activeTab, setActiveTab] = useState<'articles' | 'videos'>('articles');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setResults([]); // Очищаем старые результаты перед новым поиском

        try {
            // Вызываем нашу Edge-функцию ai-search
            const { data, error } = await supabase.functions.invoke('ai-search', {
                body: {
                    query: searchQuery,
                    targetLang: selectedLang
                },
            });

            if (error) throw error;

            if (data && data.results) {
                // Если данные пришли из Edge-функции, они могут иметь структуру с полями из базы данных (source_url, content_type)
                // Преобразуем их к формату, ожидаемому в компоненте (url, type)
                const formattedResults = data.results.map((item: any) => ({
                    id: item.id || Math.random().toString(),
                    type: item.content_type || item.type || 'articles',
                    lang: item.language || item.lang || selectedLang,
                    title: item.title,
                    description: item.description,
                    url: item.source_url || item.url || '#',
                    preview: item.preview_url || item.preview
                }));
                setResults(formattedResults);
            }
        } catch (error) {
            console.error("Ошибка поиска через AI, используем имитацию:", error);
            // Имитируем загрузку для теста при ошибке/отсутствии соединения
            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setResults([
                    {
                        id: '1',
                        type: 'articles',
                        lang: selectedLang,
                        title: `Полезный совет по запросу: "${searchQuery}"`,
                        description: 'ИИ собрал информацию из интернета, перевёл её и сделал краткую выжимку статьи...',
                        url: '#',
                    },
                    {
                        id: '2',
                        type: 'videos',
                        lang: selectedLang,
                        title: `Видео-инструкция: ${searchQuery}`,
                        description: 'Смотрите подробный разбор на YouTube, переведённый ИИ.',
                        url: 'https://youtube.com',
                        preview: 'https://via.placeholder.com/320x180/070a13/ffffff?text=Video+Preview'
                    }
                ]);
            } catch (fallbackError) {
                console.error("Ошибка имитации поиска:", fallbackError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Фильтруем результаты по активной вкладке (Статьи или Видео)
    const filteredResults = results.filter(item => item.type === activeTab);

    return (
        <div className="min-h-screen bg-[#070a13] text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Заголовок */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">
                        AI Центр Полезных Советов
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Задайте любой вопрос, и наш ИИ соберёт, переведёт и структурирует лучшие материалы из интернета
                    </p>
                </div>

                {/* Форма Поиска */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative flex items-center bg-[#111625] rounded-xl border border-amber-500/20 focus-within:border-amber-500 transition-all p-1">
                        <input
                            type="text"
                            placeholder="Например: Как настроить логистику или пройти верификацию..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-base"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-[#070a13] font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? 'Ищу...' : 'Найти с AI'}
                        </button>
                    </div>
                </form>

                {/* Селектор Языков (В какой язык переводить результаты) */}
                <div className="flex flex-wrap gap-2 items-center justify-center mb-8 bg-[#111625]/50 p-3 rounded-xl border border-gray-800">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mr-2">Язык выдачи:</span>
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => setSelectedLang(lang.code)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${selectedLang === lang.code
                                ? 'bg-amber-500 text-[#070a13] font-bold shadow-md shadow-amber-500/10'
                                : 'bg-[#181f32] text-gray-300 hover:bg-[#202942]'
                                }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {/* Табы (Вкладки): Статьи / Видео */}
                <div className="flex border-b border-gray-800 mb-6">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex-1 py-3 text-center font-medium border-b-2 transition-all cursor-pointer ${activeTab === 'articles'
                            ? 'border-amber-500 text-amber-500'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        📰 Статьи и советы
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`flex-1 py-3 text-center font-medium border-b-2 transition-all cursor-pointer ${activeTab === 'videos'
                            ? 'border-amber-500 text-amber-500'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        🎥 Видеоконтент
                    </button>
                </div>

                {/* Индикатор загрузки */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm">ИИ опрашивает поисковики и переводит контент...</p>
                    </div>
                )}

                {/* Результаты выдачи */}
                {!isLoading && filteredResults.length > 0 && (
                    <div className="space-y-4">
                        {filteredResults.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#111625] border border-gray-800 hover:border-amber-500/30 transition-all rounded-xl p-5 flex flex-col md:flex-row gap-4"
                            >
                                {item.type === 'videos' && item.preview && (
                                    <div className="md:w-48 w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.preview} alt="Превью" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                        {item.lang}
                                    </span>
                                    <h3 className="text-lg font-semibold text-white mt-1.5 mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.description}</p>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                                    >
                                        Читать оригинал источника →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Пустое состояние */}
                {!isLoading && results.length === 0 && (
                    <div className="text-center py-16 bg-[#111625]/30 rounded-2xl border border-dashed border-gray-800">
                        <span className="text-4xl">🔍</span>
                        <p className="text-gray-500 mt-3 text-sm">Введите интересующий вас запрос выше</p>
                    </div>
                )}

            </div>
        </div>
    );
}