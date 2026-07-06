import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Импортируем клиент для вызова Edge Functions

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

export default function AIChatWidget({ userId }: { userId: string }) {
    console.log("Контекст ИИ-наставника для пользователя:", userId);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: 'Ассаляму алейкум! Я ваш ИИ-наставник в Инас. Помогу составить вопросы для общения, подскажу правила Адаба или объясню, как устроена верификация встреч. О чём вы хотите спросить?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput('');

        const userMessage: Message = {
            id: Math.random().toString(),
            role: 'user',
            text: userText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            // Реальный вызов Edge Function в Supabase
            const { data, error } = await supabase.functions.invoke('inas-ai-mentor', {
                body: { message: userText, userId }
            });

            if (error) throw error;

            const botMessage: Message = {
                id: Math.random().toString(),
                role: 'assistant',
                text: data?.reply || `Согласно правилам нашей платформы, мы рекомендуем вести диалог уважительно и помнить о намерении построения крепкой семьи.`,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Ошибка ИИ-наставника:', error);

            // Фолбэк на случай, если Edge-функция еще не развернута
            const fallbackMessage: Message = {
                id: Math.random().toString(),
                role: 'assistant',
                text: `Не удалось связаться с сервером обновлений. Напоминаем о важности соблюдения Адаба при планировании встреч.`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, fallbackMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center relative group"
                >
                    <span className="text-2xl">✨</span>
                    <span className="absolute right-16 bg-slate-900 border border-slate-800 text-slate-300 text-xs py-1.5 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:inline-block">
                        ИИ-Наставник Инас
                    </span>
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 md:absolute md:inset-auto md:bottom-0 md:right-0 w-full h-full md:w-[380px] md:h-[520px] bg-[#0f172a] border border-slate-800/80 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-white">
                    <div className="bg-[#070a12] p-4 border-b border-slate-800/60 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg">
                                ✨
                            </div>
                            <div>
                                <h4 className="text-sm font-bold tracking-wide text-amber-400">Наставник Инас</h4>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ИИ-Модератор онлайн
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition p-1 text-lg">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0d1324] scrollbar-thin">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-slate-800/80 text-slate-200 border border-slate-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/80 border border-slate-800 rounded-2xl rounded-bl-none p-3 text-xs text-slate-400 flex items-center gap-2">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce delay-100">●</span>
                                    <span className="animate-bounce delay-200">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-2 bg-[#070a12]/50 border-t border-slate-800/40 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                        <button onClick={() => setInput('Какие вопросы задать на первой встрече?')} className="bg-slate-800/40 border border-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] transition">📋 Вопросы для встречи</button>
                        <button onClick={() => setInput('Что такое Адаб общения в приложении?')} className="bg-slate-800/40 border border-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] transition">🛡️ Правила Адаба</button>
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 bg-[#070a12] border-t border-slate-800/60 flex gap-2">
                        <input
                            type="text"
                            placeholder="Спросить наставника..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 transition"
                        />
                        <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 rounded-xl font-bold text-xs transition active:scale-95">Отправить</button>
                    </form>
                </div>
            )}
        </div>
    );
}