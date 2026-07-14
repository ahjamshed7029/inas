import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface GroqResponse {
    choices: Array<{ message: ChatMessage }>;
}

type LangType = 'uz' | 'ru' | 'kk' | 'tg' | 'ky' | 'tk';
type MainTab = 'wedding' | 'health' | 'sharia' | 'creative' | 'couple';
type HealthSubTab = 'naturopathy' | 'nutrition' | 'meds';

export const AdabHub: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLang = (i18n.language || 'uz') as LangType;

    // Состояния вкладок
    const [activeTab, setActiveTab] = useState<MainTab>('wedding');
    const [healthSubTab, setHealthSubTab] = useState<HealthSubTab>('naturopathy');

    // Анкета поиска пары
    const [coupleGender, setCoupleGender] = useState<string>('');
    const [coupleAge, setCoupleAge] = useState<string>('');
    const [coupleHeight, setCoupleHeight] = useState<string>('');
    const [coupleWeight, setCoupleWeight] = useState<string>('');
    const [couplePrefs, setCouplePrefs] = useState<string>('');
    const [isEditingCouple, setIsEditingCouple] = useState<boolean>(true);

    // Поля ввода
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [analysisFile, setAnalysisFile] = useState<File | null>(null);
    const [medFile, setMedFile] = useState<File | null>(null);

    // AI состояние
    const [aiLoading, setAiLoading] = useState<boolean>(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [aiResult, setAiResult] = useState<string | null>(null);

    // Вспомогательная функция для конвертации файла в Base64 (чтобы прочесть unused переменные)
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Общий метод для выполнения запросов к Groq
    const executeGroqRequest = async (systemContent: string, userContent: string) => {
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemContent },
                        { role: 'user', content: userContent },
                    ],
                    max_tokens: 1500,
                    temperature: 0.5,
                }),
            });

            if (!response.ok) throw new Error('Ошибка сети API');
            const data: GroqResponse = await response.json();
            setAiResult(data.choices?.[0]?.message?.content || 'Нет ответа.');
        } catch (err: any) {
            setAiError(err.message || 'Ошибка генерации.');
        } finally {
            setAiLoading(false);
        }
    };

    // Функция отправки стандартных запросов
    const handleSendRequest = async (inputValue: string) => {
        if (!inputValue.trim()) return;

        setAiLoading(true);
        setAiError(null);
        setAiResult(null);

        try {
            // Динамически собираем роль эксперта в зависимости от активной вкладки
            let expertRole = `Ты эксперт экосистемы Adab Markazi. Отвечай на языке: ${currentLang}. `;

            if (activeTab === 'wedding') {
                expertRole += "Ты специалист по организации свадеб по Шариату (Никях). Помоги найти лучшие варианты.";
            } else if (activeTab === 'health') {
                if (healthSubTab === 'naturopathy') {
                    expertRole += "Ты эксперт по натуропатии. Анализируй анализы (если прикреплены) и рекомендуй природные подходы с оговоркой обратиться к врачу.";
                } else if (healthSubTab === 'nutrition') {
                    expertRole += "Ты диетолог. Подскажи как и чем правильно питаться, составь рацион по Сунне и науке.";
                } else if (healthSubTab === 'meds') {
                    expertRole += "Ты эксперт по лекарствам и травам. Помоги узнать подлинность и свойства по фото/названию.";
                }
            } else if (activeTab === 'sharia') {
                expertRole += "Ты исламский ученый. Твоя задача искать ответы в интернете, YouTube и достоверных источниках. Давай ответы строго с исламскими правовыми оговорками.";
            } else if (activeTab === 'creative') {
                expertRole += "Помоги пользователю найти статьи и видео в интернете, а также структурировать их творчество.";
            }

            // Читаем файлы, если они прикреплены в соответствующих вкладках здоровья
            let attachedFileBase64: string | null = null;
            if (activeTab === 'health') {
                if (healthSubTab === 'naturopathy' && analysisFile) {
                    attachedFileBase64 = await fileToBase64(analysisFile);
                } else if (healthSubTab === 'meds' && medFile) {
                    attachedFileBase64 = await fileToBase64(medFile);
                }
            }

            // Запрос к Edge-функции
            const response = await fetch('https://fjaxhiohvkabwlcfwxcs.supabase.co/functions/v1/global-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: inputValue,
                    language: currentLang,
                    expert_role: expertRole,
                    file: attachedFileBase64 // Теперь переменные используются и уходят на бэкенд
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при запросе к поисковому ассистенту');
            }

            const data = await response.json();
            setAiResult(data.answer || 'Нет ответа.');

        } catch (error: any) {
            console.error("Ошибка:", error);
            setAiError(error.message || "Произошла ошибка при получении ответа. Попробуйте позже.");
        } finally {
            setAiLoading(false);
        }
    };

    // Функция отправки анкеты поиска пары на ИИ мэтчинг
    const handleCoupleMatchRequest = async () => {
        if (!coupleGender || !coupleAge || !couplePrefs) {
            setAiError(t('couple_error_fields'));
            return;
        }

        setAiLoading(true);
        setAiError(null);
        setAiResult(null);

        const systemPrompt = `Ты — продвинутый AI-агент семейного мэтчинга и профессиональный психолог экосистемы Adab Markazi. Отвечай строго на языке: ${currentLang}.`;

        const userPrompt = `
          Твоя задача — составить подробный психологический портрет пользователя на основе его анкеты и подобрать ему наиболее подходящие психотипы кандидатов.

          ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
          - Пол: ${coupleGender === 'male' ? 'Мужской' : 'Женский'}
          - Возраст: ${coupleAge} лет
          - Рост: ${coupleHeight ? coupleHeight + ' см' : 'Не указан'}
          - Вес: ${coupleWeight ? coupleWeight + ' кг' : 'Не указан'}
          - Описание характера и ценностей: "${couplePrefs}"

          ИНСТРУКЦИЯ ДЛЯ АГЕНТА:
          1. На основе описания составь психологический портрет личности (его скрытые потребности, сильные стороны, ценности в браке).
          2. Сформируй профиль идеального кандидата, который ментально и духовно дополнит этого человека.
          3. ПРЕДЛОЖИ КАНДИДАТОВ: Опиши 2-3 детальных психологических типажа/кандидата, которые идеально подойдут этому пользователю. 
          4. СТРОГОЕ ПРАВИЛО: Твои предложения НЕ должны ограничиваться жесткими рамками возраста или места жительства. Приоритет — духовная зрелость, общность взглядов, характер и взаимодополняемость, даже если идеальный кандидат старше/младше или находится в другом регионе/городе.

          Выдай ответ в красивом структурированном виде, используя маркдаун форматирование.
        `;

        await executeGroqRequest(systemPrompt, userPrompt);
        setIsEditingCouple(false);
    };

    return (
        <div style={{ padding: '15px', maxWidth: '480px', margin: '0 auto', color: '#fff', backgroundColor: '#0d1117', fontFamily: 'sans-serif', minHeight: '85vh', borderRadius: '16px' }}>

            {/* СТИЛИЗОВАННЫЕ КНОПКИ ВЕРХНИХ ТАБОВ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
                <button onClick={() => { setActiveTab('wedding'); setAiResult(null); setAiError(null); }} style={{ width: '85%', padding: '12px', borderRadius: '24px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'wedding' ? '#dfb76c' : '#1f242c', color: activeTab === 'wedding' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                    🏪 {t('tab_services')}
                </button>
                <button onClick={() => { setActiveTab('couple'); setAiResult(null); setAiError(null); }} style={{ width: '85%', padding: '12px', borderRadius: '24px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'couple' ? '#dfb76c' : '#1f242c', color: activeTab === 'couple' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                    🔍 {t('search')}
                </button>
                <button onClick={() => { setActiveTab('health'); setAiResult(null); setAiError(null); }} style={{ width: '85%', padding: '12px', borderRadius: '24px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'health' ? '#dfb76c' : '#1f242c', color: activeTab === 'health' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                    🍏 {t('tab_health')}
                </button>
                <button onClick={() => { setActiveTab('sharia'); setAiResult(null); setAiError(null); }} style={{ width: '85%', padding: '12px', borderRadius: '24px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'sharia' ? '#dfb76c' : '#1f242c', color: activeTab === 'sharia' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                    📜 {t('tab_sharia')}
                </button>
                <button onClick={() => { setActiveTab('creative'); setAiResult(null); setAiError(null); }} style={{ width: '85%', padding: '12px', borderRadius: '24px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'creative' ? '#dfb76c' : '#1f242c', color: activeTab === 'creative' ? '#000' : '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                    ✍️ {t('tab_creative')}
                </button>
            </div>

            <hr style={{ border: '0.5px solid #21262d', marginBottom: '20px' }} />

            {/* ========== 1. РАЗДЕЛ СВАДЬБЫ ========== */}
            {activeTab === 'wedding' && (
                <div>
                    <h3 style={{ color: '#dfb76c', fontSize: '16px', textAlign: 'center' }}>{t('sec_wedding')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                        {[
                            { name: t('cat_rest'), icon: '🍽️' },
                            { name: t('cat_tailor'), icon: '✂️' },
                            { name: t('cat_beauty_salon'), icon: '💄' },
                            { name: t('cat_tamada'), icon: '🎤' },
                            { name: t('cat_flowers'), icon: '💐' },
                            { name: t('cat_cars'), icon: '🚗' },
                            { name: t('cat_svaha'), icon: '🧕' },
                            { name: t('cat_video'), icon: '📸' },
                            { name: t('cat_confectioners'), icon: '🎂' }
                        ].map((cat, idx) => (
                            <button key={idx} onClick={() => { setSearchQuery(`Показать ${cat.name}`); handleSendRequest(`Показать предложения в категории: ${cat.name}`); }} style={{ padding: '12px 8px', backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                                <span style={{ textAlign: 'center' }}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ========== РАЗДЕЛ ПОИСКА ПАРЫ (АНКЕТА И АГЕНТ) ========== */}
            {activeTab === 'couple' && (
                <div style={{ backgroundColor: '#161b22', padding: '15px', borderRadius: '12px', border: '1px solid #30363d' }}>

                    {/* ЗАГОЛОВОК И КНОПКА РЕДАКТИРОВАНИЯ */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: '#dfb76c', margin: 0, fontSize: '16px' }}>
                            {t('couple_title')}
                        </h3>
                        {!isEditingCouple && aiResult && (
                            <button
                                onClick={() => setIsEditingCouple(true)}
                                style={{ backgroundColor: '#21262d', color: '#dfb76c', border: '1px solid #30363d', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                            >
                                ✏️ {t('Edit Questionnaire')}
                            </button>
                        )}
                    </div>

                    {/* Условие: Либо заполняем анкету, либо смотрим результат анализа ИИ */}
                    {isEditingCouple ? (
                        <div>
                            {/* Выбор Пола */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{t('couple_label_gender')}</label>
                                <select value={coupleGender} onChange={(e) => setCoupleGender(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '8px' }}>
                                    <option value="">...</option>
                                    <option value="male">{t('couple_gender_male')}</option>
                                    <option value="female">{t('couple_gender_female')}</option>
                                </select>
                            </div>

                            {/* Возраст, Рост, Вес */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{t('couple_label_age')}</label>
                                    <input type="number" value={coupleAge} onChange={(e) => setCoupleAge(e.target.value)} placeholder="25" style={{ width: '100%', padding: '10px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '8px', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{t('couple_label_height')}</label>
                                    <input type="number" value={coupleHeight} onChange={(e) => setCoupleHeight(e.target.value)} placeholder="175" style={{ width: '100%', padding: '10px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '8px', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{t('couple_label_weight')}</label>
                                    <input type="number" value={coupleWeight} onChange={(e) => setCoupleWeight(e.target.value)} placeholder="70" style={{ width: '100%', padding: '10px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '8px', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            {/* Предпочтения и Описание характера */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{t('couple_label_prefs')}</label>
                                <textarea value={couplePrefs} onChange={(e) => setCouplePrefs(e.target.value)} placeholder={t('couple_placeholder_prefs')} style={{ width: '100%', padding: '10px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '8px', boxSizing: 'border-box' }} rows={4} />
                            </div>

                            <button onClick={handleCoupleMatchRequest} style={{ width: '100%', padding: '12px', backgroundColor: '#dfb76c', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
                                🚀 {t('Сохранить и отправить Агенту')}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(223, 183, 108, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(223, 183, 108, 0.3)', marginBottom: '15px' }}>
                                <span style={{ fontSize: '20px' }}>🤖</span>
                                <p style={{ margin: 0, fontSize: '13px', color: '#dfb76c', fontWeight: '500' }}>
                                    Анкета успешно сохранена! Ваш персональный ИИ-агент составил разбор:
                                </p>
                            </div>

                            {/* Краткая сводка */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                                <span style={{ fontSize: '11px', backgroundColor: '#21262d', padding: '4px 8px', borderRadius: '12px', color: '#8b949e' }}>Пол: {coupleGender === 'male' ? 'М' : 'Ж'}</span>
                                <span style={{ fontSize: '11px', backgroundColor: '#21262d', padding: '4px 8px', borderRadius: '12px', color: '#8b949e' }}>Возраст: {coupleAge}</span>
                                {coupleHeight && <span style={{ fontSize: '11px', backgroundColor: '#21262d', padding: '4px 8px', borderRadius: '12px', color: '#8b949e' }}>Рост: {coupleHeight}см</span>}
                            </div>

                            {/* Вывод ответа от Groq во вкладке */}
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6', color: '#c9d1d9', backgroundColor: '#0d1117', padding: '12px', borderRadius: '8px', border: '1px solid #21262d' }}>
                                {aiResult}
                            </div>

                            <button
                                onClick={() => setIsEditingCouple(true)}
                                style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: 'transparent', color: '#8b949e', border: '1px solid #30363d', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                            >
                                🔄 Изменить данные анкеты
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ========== 2. РАЗДЕЛ ЗДОРОВЬЯ И НАТУРОПАТИИ ========== */}
            {activeTab === 'health' && (
                <div>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                        {(['naturopathy', 'nutrition', 'meds'] as HealthSubTab[]).map((sub) => (
                            <button key={sub} onClick={() => { setHealthSubTab(sub); setAiResult(null); setAiError(null); }} style={{ flex: 1, padding: '8px 5px', fontSize: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: healthSubTab === sub ? '#dfb76c' : '#21262d', color: healthSubTab === sub ? '#000' : '#fff' }}>
                                {sub === 'naturopathy' ? t('subtab_naturopathy') : sub === 'nutrition' ? t('subtab_nutrition') : t('subtab_meds')}
                            </button>
                        ))}
                    </div>

                    {healthSubTab === 'naturopathy' && (
                        <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '8px', border: '1px solid #30363d' }}>
                            <p style={{ fontSize: '13px', color: '#8b949e' }}>{t('health_naturopathy_desc')}</p>
                            <input type="file" onChange={(e) => setAnalysisFile(e.target.files?.[0] || null)} style={{ margin: '10px 0', fontSize: '13px', color: '#8b949e' }} />
                            <textarea value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('health_placeholder_naturopathy')} style={{ width: '100%', padding: '8px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '6px', boxSizing: 'border-box' }} rows={3} />
                            <button onClick={() => handleSendRequest(searchQuery)} style={{ width: '100%', marginTop: '8px', padding: '10px', backgroundColor: '#dfb76c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {t('health_btn_naturopathy')}
                            </button>
                        </div>
                    )}

                    {healthSubTab === 'nutrition' && (
                        <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '8px', border: '1px solid #30363d' }}>
                            <p style={{ fontSize: '13px', color: '#8b949e' }}>{t('health_nutrition_desc')}</p>
                            <textarea value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('health_placeholder_nutrition')} style={{ width: '100%', padding: '8px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '6px', boxSizing: 'border-box' }} rows={3} />
                            <button onClick={() => handleSendRequest(searchQuery)} style={{ width: '100%', marginTop: '8px', padding: '10px', backgroundColor: '#dfb76c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {t('health_btn_nutrition')}
                            </button>
                        </div>
                    )}

                    {healthSubTab === 'meds' && (
                        <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '8px', border: '1px solid #30363d' }}>
                            <p style={{ fontSize: '13px', color: '#8b949e' }}>{t('health_meds_desc')}</p>
                            <input type="file" accept="image/*" onChange={(e) => setMedFile(e.target.files?.[0] || null)} style={{ margin: '10px 0', fontSize: '13px', color: '#8b949e' }} />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('health_placeholder_meds')} style={{ width: '100%', padding: '8px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '6px', marginBottom: '8px', boxSizing: 'border-box' }} />
                            <button onClick={() => handleSendRequest(searchQuery)} style={{ width: '100%', padding: '10px', backgroundColor: '#dfb76c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {t('health_btn_meds')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ========== 3. РАЗДЕЛ ШАРИАТА ========== */}
            {activeTab === 'sharia' && (
                <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '8px', border: '1px solid #30363d' }}>
                    <p style={{ fontSize: '13px', color: '#dfb76c', marginBottom: '10px' }}>⚠️ {t('sharia_title')}</p>
                    <textarea value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('sharia_input_placeholder')} style={{ width: '100%', padding: '8px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '6px', boxSizing: 'border-box' }} rows={4} />
                    <button onClick={() => handleSendRequest(searchQuery)} style={{ width: '100%', marginTop: '10px', padding: '12px', backgroundColor: '#dfb76c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {t('sharia_btn')}
                    </button>
                </div>
            )}

            {/* ========== 4. ТВОРЧЕСТВО И БЛОГИ ========== */}
            {activeTab === 'creative' && (
                <div>
                    <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '8px', border: '1px solid #30363d', marginBottom: '15px' }}>
                        <p style={{ fontSize: '13px', color: '#8b949e' }}>{t('creative_search_desc')}</p>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('creative_placeholder_search')} style={{ width: '100%', padding: '8px', backgroundColor: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '6px', marginBottom: '8px', boxSizing: 'border-box' }} />
                        <button onClick={() => handleSendRequest(searchQuery)} style={{ width: '100%', padding: '10px', backgroundColor: '#dfb76c', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {t('creative_btn_search')}
                        </button>
                    </div>
                </div>
            )}

            {/* ========== ОБЩИЙ ВЫВОД ОШИБОК И ЗАГРУЗКИ ДЛЯ ОСТАЛЬНЫХ ТАБОВ ========== */}
            {aiLoading && <p style={{ textAlign: 'center', color: '#dfb76c', fontSize: '14px' }}>{t('ai_loading')}</p>}
            {aiError && <div style={{ color: '#ff7b72', padding: '10px', border: '1px solid #f85149', borderRadius: '6px', marginTop: '15px', backgroundColor: 'rgba(248,81,73,0.1)', fontSize: '13px' }}>{aiError}</div>}

            {/* Дефолтный блок результатов для всех вкладок, кроме couple */}
            {aiResult && activeTab !== 'couple' && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #30363d', borderRadius: '8px', backgroundColor: '#161b22' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#dfb76c' }}>{t('ai_result_title')}</h4>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5', color: '#c9d1d9' }}>{aiResult}</div>
                </div>
            )}
        </div>
    );
};