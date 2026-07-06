import { useState } from 'react';

interface Candidate {
    id: string;
    name: string;
    age: number;
    city: string;
    source: string; // Откуда найден (TG, VK и т.д.)
    bio: string;
    aiReason: string; // Почему ИИ выбрал его
    suggestedMessage: string; // Текст приветствия от ИИ
}

export default function AICandidates() {
    // Демо-данные для визуализации работы ИИ-агента
    const [candidates] = useState<Candidate[]>([
        {
            id: '1',
            name: 'Амина',
            age: 24,
            city: 'Казань',
            source: 'Telegram: @islam_family_channel',
            bio: 'Соблюдаю столпы ислама, изучаю арабский язык. Ищу благонравного супруга для создания крепкой семьи ради Довольства Аллаха.',
            aiReason: 'ИИ-Агент: Совпадение ценностей 94%. Общие цели в изучении религии и схожие взгляды на семейный уклад.',
            suggestedMessage: 'Ассаляму алейкум, Амина. Меня заинтересовала ваша анкета, найденная нашим ИИ-помощником. Вы упомянули изучение арабского — я тоже считаю это важным шагом. Буду рад пообщаться в рамках Адаба, если вы не против.'
        },
        {
            id: '2',
            name: 'Марьям',
            age: 22,
            city: 'Москва',
            source: 'Исламский халяль-социум (внешняя база)',
            bio: 'Получаю медицинское образование. Чту семейные традиции, ценю искренность и стремление к дозволенному заработку.',
            aiReason: 'ИИ-Агент: У вас совпадает желаемый город проживания и требования к образованию супруги.',
            suggestedMessage: 'Ассаляму алейкум, Марьям. Мой ИИ-ассистент обратил внимание на вашу анкету из сообщества. Очень уважаю вашу будущую профессию врача. Рассмотрели бы вы возможность знакомства для создания семьи?'
        }
    ]);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center p-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-xs text-amber-300 font-medium">
                    ✨ ИИ-Агент ежедневно анализирует открытые исламские сообщества и подбирает анкеты, которых ещё нет в приложении!
                </p>
            </div>

            <div className="space-y-4">
                {candidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
                    >
                        {/* Шапка карточки */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    {candidate.name}, {candidate.age}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                                        {candidate.city}
                                    </span>
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Найдено: <span className="text-amber-400/80">{candidate.source}</span>
                                </p>
                            </div>
                        </div>

                        {/* Биография */}
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                            {candidate.bio}
                        </p>

                        {/* Почему выбрал ИИ */}
                        <div className="text-[11px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl">
                            🎯 {candidate.aiReason}
                        </div>

                        {/* Предложение от ИИ */}
                        <div className="space-y-1.5 pt-1">
                            <label className="text-[11px] font-semibold text-slate-400 block">
                                🧠 Грамотное приветствие от ИИ (готово к отправке):
                            </label>
                            <div className="relative bg-[#070a13] border border-slate-800 rounded-xl p-3 text-xs text-slate-300 italic leading-relaxed">
                                "{candidate.suggestedMessage}"
                                <button
                                    onClick={() => copyToClipboard(candidate.suggestedMessage, candidate.id)}
                                    className="absolute bottom-2 right-2 text-[10px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg transition-all"
                                >
                                    {copiedId === candidate.id ? 'Скопировано! ✓' : 'Копировать'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}