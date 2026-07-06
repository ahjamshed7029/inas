import { useState, useEffect } from 'react';
import Paywall from './Paywall';

interface ActiveChatProps {
    userId: string;
    userGender: 'male' | 'female';
}

interface Message {
    id: string;
    sender_id: string;
    text: string;
    created_at: string;
}

export default function ActiveChat({ userId, userGender }: ActiveChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender_id: 'other', text: 'Ассаляму алейкум! Прочитал(а) вашу анкету, очень откликаются ваши жизненные цели.', created_at: '2 дня назад' },
        { id: '2', sender_id: userId, text: 'Ва алейкум ассалям! Рад(а) знакомству. Расскажите, пожалуйста, подробнее о ваших взглядах на брак.', created_at: 'Вчера' }
    ]);
    const [inputText, setInputText] = useState('');

    // Симуляция дней: 1, 2 или 3 день общения
    const [chatAgeDays, setChatAgeDays] = useState<number>(1);

    // Управление состоянием Paywall
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [paywallReason, setPaywallReason] = useState<'early_video' | 'day_3_limit'>('early_video');

    // АВТОМАТИЧЕСКИЙ ТРИГГЕР НА 3-Й ДЕНЬ
    useEffect(() => {
        if (chatAgeDays >= 3) {
            setPaywallReason('day_3_limit');
            setIsPaywallOpen(true); // Открываем Paywall автоматически без кликов!
        }
    }, [chatAgeDays]);

    // Логика нажатия на кнопку Видеозвонка (для 1 и 2 дня)
    const handleVideoClick = () => {
        if (chatAgeDays < 3) {
            setPaywallReason('early_video');
            setIsPaywallOpen(true);
        } else {
            setPaywallReason('day_3_limit');
            setIsPaywallOpen(true);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender_id: userId,
            text: inputText,
            created_at: 'Только что'
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-[65vh] bg-slate-950/40 border border-slate-800/60 rounded-3xl overflow-hidden relative">

            {/* Шапка чата */}
            <div className="bg-[#0f172a]/90 border-b border-slate-800 p-3.5 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm shadow-md">
                        {userGender === 'male' ? '🧕' : '🧔'}
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-white">Собеседник</h4>
                        <p className="text-[10px] text-emerald-400 font-medium">Общение по Адабу</p>
                    </div>
                </div>

                {/* Кнопка Видеозвонка */}
                <button
                    onClick={handleVideoClick}
                    className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                    <span>📹</span>
                    <span>Видеосвязь</span>
                </button>
            </div>

            {/* Окно переписки */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-none">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col max-w-[75%] space-y-0.5 ${msg.sender_id === userId ? 'ml-auto items-end' : 'mr-auto items-start'
                            }`}
                    >
                        <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender_id === userId
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none'
                                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-500 px-1">{msg.created_at}</span>
                    </div>
                ))}
            </div>

            {/* Форма ввода текста */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0f172a]/90 border-t border-slate-800/80 flex gap-2 items-center">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Напишите уважительное сообщение..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-600"
                />
                <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                    Отправить
                </button>
            </form>

            {/* Переключатель дней для теста */}
            <div className="absolute bottom-16 left-3 bg-slate-900/95 border border-slate-800 rounded-lg p-1.5 flex gap-1.5 items-center text-[9px] text-slate-400 z-10 shadow-xl">
                <span>День общения:</span>
                {[1, 2, 3].map((d) => (
                    <button
                        key={d}
                        type="button"
                        onClick={() => setChatAgeDays(d)}
                        className={`px-1.5 py-0.5 rounded transition-all ${chatAgeDays === d ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950'}`}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {/* Экран оплаты */}
            <Paywall
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                reason={paywallReason}
            />

        </div>
    );
}