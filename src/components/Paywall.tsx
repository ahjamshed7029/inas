import { useState } from 'react';

interface PaywallProps {
    isOpen: boolean;
    onClose: () => void;
    reason: 'early_video' | 'day_3_limit'; // Причина показа подписки
}

export default function Paywall({ isOpen, onClose, reason }: PaywallProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden">

                {/* Декоративный светящийся фон */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>

                {/* Кнопка закрыть */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-sm font-bold bg-slate-900 w-7 h-7 rounded-full flex items-center justify-center border border-slate-800"
                >
                    ×
                </button>

                {/* Иконка */}
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-amber-500/10">
                    {reason === 'early_video' ? '📹' : '✨'}
                </div>

                {/* Динамический текст в зависимости от триггера */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-wide">
                        {reason === 'early_video' ? 'Переход к видеозвонку' : 'Перейдите на Премиум-уровень'}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed px-2">
                        {reason === 'early_video'
                            ? 'Вы общаетесь второй день и уже готовы увидеть друг друга! Чтобы активировать функцию защищенного видеочата по правилам Адаба, необходима подписка. Это подтверждает серьезность намерений сторон.'
                            : 'Вы общаетесь уже третий день! Чтобы защитить ваше время, сделать следующий шаг и открыть доступ к видеозвонкам и подсказкам ИИ-Наставника, активируйте подписку.'
                        }
                    </p>
                </div>

                {/* Список преимуществ */}
                <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-3.5 text-left text-xs text-slate-300 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <span className="text-amber-400">⚡</span>
                        <span>Безлимитные видеозвонки (с махрамом или тет-а-тет)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className="text-amber-400">🧠</span>
                        <span>Глубокий анализ совместимости анкет от ИИ</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <span className="text-amber-400">🛡️</span>
                        <span>Значок серьёзных намерений в профиле</span>
                    </div>
                </div>

                {/* Цена и кнопка */}
                <div className="space-y-3 pt-1">
                    <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1.5">
                        $6.00 <span className="text-xs font-normal text-slate-400">/ месяц</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                        Подписку можно отменить в любой момент в Личном Меню.<br />Автопродление раз в 30 дней.
                    </p>

                    <button
                        onClick={() => {
                            setLoading(true);
                            setTimeout(() => {
                                setLoading(false);
                                alert('Интеграция платежной системы (ЮKassa / Stripe). Платеж прошел успешно!');
                                onClose();
                            }, 1500);
                        }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-black py-3 rounded-xl text-xs tracking-wider shadow-lg shadow-amber-500/10 transition-all uppercase"
                    >
                        {loading ? 'Обработка платежа...' : 'Активировать подписку'}
                    </button>
                </div>

            </div>
        </div>
    );
}