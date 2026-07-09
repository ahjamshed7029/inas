import React, { useState } from 'react';

// Интерфейсы для типизации ответа Hyperbolic API
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatChoice {
    index: number;
    message: ChatMessage;
    finish_reason: string;
}

interface HyperbolicResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: ChatChoice[];
}

interface AiResultState {
    aiGeneratedText: string;
    sourceLinks: string[];
    youtubeVideos: string[];
}

type LangType = 'ru' | 'kk' | 'uz';

export const AdabHub: React.FC = () => {
    // Селекторы и инпуты
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentLang, setCurrentLang] = useState<LangType>('ru');
    const [selectedProfile, setSelectedProfile] = useState<string>('');
    const [selectedDirection, setSelectedDirection] = useState<string>('');

    // Состояния загрузки, ошибок и результата
    const [aiLoading, setAiLoading] = useState<boolean>(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<AiResultState | null>(null);

    const handleGenerateAIContent = async () => {
        if (!searchQuery.trim()) {
            const errorMessages: Record<LangType, string> = {
                uz: 'Илтимос, қидирув сатрига саволингизни киритинг!',
                kk: 'Өтініш, іздеу жолына сұрағыңызды енгізіңіз!',
                ru: 'Пожалуйста, введите ваш вопрос в строку поиска!',
            };
            setAiError(errorMessages[currentLang]);
            return;
        }

        setAiLoading(true);
        setAiError(null);
        setAiResult(null);

        // Сборка системного промпта в зависимости от языка
        let systemPrompt = "You are an expert AI assistant. Answer the user's question clearly.";
        if (currentLang === 'ru') {
            systemPrompt = `Ты эксперт-наставник. Отвечай строго на русском языке. Дай развернутый и полезный ответ на вопрос пользователя. Учитывай категорию профиля: ${selectedProfile || 'Общая'} и направление знаний: ${selectedDirection || 'Общее'}.`;
        } else if (currentLang === 'kk') {
            systemPrompt = `Сіз сарапшы көмекшісіз. Пайдаланушы сұрағына тек қазақ тілінде жауап беріңіз. Профиль санатын: ${selectedProfile || 'Жалпы'} және бағытты ескеріңіз: ${selectedDirection || 'Жалпы'}.`;
        } else if (currentLang === 'uz') {
            systemPrompt = `Siz ekspert yordamchisiz. Foydalanuvchi savoliga faqat o'zbek tilida (lotin alifbosida) javob bering. Foydalanuvchi profili: ${selectedProfile || 'Umumiy'}, Yo'nalish: ${selectedDirection || 'Umumiy'}.`;
        }

        // Извлекаем токен из окружения Vite
        const apiKey = import.meta.env.VITE_HYPERBOLIC_API_KEY;

        if (!apiKey) {
            setAiError('Критическая ошибка: API ключ не найден в конфигурации .env');
            setAiLoading(false);
            return;
        }

        try {
            // Изменяем URL на эндпоинт Groq
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`, // Твой новый ключ
                },
                body: JSON.stringify({
                    // Используем мощную бесплатную модель Llama 3.3
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: searchQuery },
                    ],
                    max_tokens: 1200,
                    temperature: 0.6,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка сервера Hyperbolic (${response.status}): ${errorText}`);
            }

            const data: HyperbolicResponse = await response.json();
            const aiGeneratedText = data.choices?.[0]?.message?.content || 'Не удалось извлечь текст ответа.';

            setAiResult({
                aiGeneratedText,
                sourceLinks: [],
                youtubeVideos: [],
            });

        } catch (err: unknown) {
            console.error("Ошибка при работе с Hermes 3:", err);
            if (err instanceof Error) {
                setAiError(err.message);
            } else {
                setAiError('Произошла непредвиденная ошибка сети.');
            }
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>AdabHub AI Помощник</h2>

            {/* Выбор языка */}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px' }}>Язык / Тіл / Tili:</label>
                <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value as LangType)}>
                    <option value="ru">Русский</option>
                    <option value="kk">Қазақша</option>
                    <option value="uz">O'zbekcha</option>
                </select>
            </div>

            {/* Поле поиска */}
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder={currentLang === 'uz' ? 'Savolingizni kiriting...' : currentLang === 'kk' ? 'Сұрағыңызды енгізіңіз...' : 'Введите ваш вопрос...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <button
                    onClick={handleGenerateAIContent}
                    disabled={aiLoading}
                    style={{ padding: '10px 20px', cursor: aiLoading ? 'not-allowed' : 'pointer' }}
                >
                    {aiLoading ? 'Генерация...' : 'Спросить AI'}
                </button>
            </div>

            {/* Ошибки */}
            {aiError && (
                <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', marginBottom: '15px' }}>
                    <strong>Ошибка:</strong> {aiError}
                </div>
            )}

            {/* Результат генерации */}
            {aiResult && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                    <h3>Ответ нейросети:</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{aiResult.aiGeneratedText}</p>
                </div>
            )}
        </div>
    );
};