import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AIPairMatching } from './AIPairMatching'; // Импортируем наш новый чистый компонент

interface Candidate {
    id: string;
    display_name: string;
    about_me: string;
    religious_practise?: string;
    family_values?: string;
    location?: string;
}

export default function Recommendations({ userId }: { userId: string }) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [introMessage, setIntroMessage] = useState('');
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [countdown, setCountdown] = useState(120); // 2 минуты в секундах

    useEffect(() => {
        fetchRecommendations();
    }, [userId]);

    // Таймер для 2-минутного видеозвонка
    useEffect(() => {
        let timer: any;
        if (showVideoCall && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        } else if (countdown === 0) {
            setShowVideoCall(false);
            alert("Время видеознакомства истекло. Вы можете перейти к шагу официальной встречи с Махрамом.");
        }
        return () => clearInterval(timer);
    }, [showVideoCall, countdown]);

    async function fetchRecommendations() {
        setLoading(true);
        try {
            // 1. Узнаем пол
            const { data: profile } = await supabase.from('profiles').select('gender').eq('id', userId).single();
            if (!profile) return;
            const targetGender = profile.gender === 'male' ? 'female' : 'male';

            // 2. Получаем список тех, кого мы уже проигнорировали
            const { data: ignored } = await supabase.from('ignored_users').select('ignored_user_id').eq('user_id', userId);
            const ignoredIds = ignored?.map((i: any) => i.ignored_user_id) || [];

            // 3. Загружаем анкеты без ограничения по возрасту
            const { data } = await supabase
                .from('questionnaires')
                .select(`id, display_name, about_me, religious_practise, family_values, location, profiles!inner(gender)`)
                .eq('profiles.gender', targetGender)
                .eq('is_active', true);

            if (data) {
                // Фильтруем тех, кто в игноре и себя самого
                const filtered = (data as any[]).filter(c => c.id !== userId && !ignoredIds.includes(c.id));
                setCandidates(filtered);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleConnect = async (candidateId: string) => {
        if (!introMessage.trim()) {
            alert("Напишите приветственное сообщение, чтобы человек понял ваши намерения.");
            return;
        }

        try {
            const { error } = await supabase.from('matches').insert([
                {
                    sender_id: userId,
                    receiver_id: candidateId,
                    status: 'pending',
                    notes: introMessage
                }
            ]);

            if (error) throw error;

            alert("Ваше сообщение и анкета успешно отправлены кандидату!");
            setIntroMessage('');
            nextCard();
        } catch (e: any) {
            alert(e.message || "Ошибка отправки");
        }
    };

    const handleIgnore = async (candidateId: string) => {
        try {
            await supabase.from('ignored_users').insert([
                { user_id: userId, ignored_user_id: candidateId }
            ]);
            nextCard();
        } catch (e) {
            console.error(e);
        }
    };

    const nextCard = () => {
        setCurrentIndex(prev => prev + 1);
    };

    const triggerMatchSuccess = () => {
        setCountdown(120);
        setShowVideoCall(true);
    };

    if (loading) return <div className="text-center text-slate-400 py-10">Загрузка подходящих анкет...</div>;

    // Экран видеозвонка
    if (showVideoCall) {
        return (
            <div className="w-full max-w-md bg-black border-4 border-amber-500 rounded-3xl p-6 text-center text-white mx-auto my-4 space-y-6 shadow-2xl">
                <div className="bg-red-600 inline-block px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    ПРЯМОЙ ЭФИР: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold">Первое знакомство лицом к лицу</h3>
                <div className="grid grid-cols-1 gap-3 aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500">
                    [ Место для WebRTC / Agora видеопотока собеседника ]
                </div>
                <div className="w-32 aspect-video bg-slate-800 rounded-xl mx-auto border border-slate-700 flex items-center justify-center text-xs text-slate-500">
                    [ Вы ]
                </div>
                <p className="text-xs text-slate-400">
                    Время строго ограничено 2 минутами согласно Адабу, чтобы защитить границы сторон. По окончании звонка вы сможете запросить контакты махрама.
                </p>
                <button
                    onClick={() => setShowVideoCall(false)}
                    className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl text-xs font-medium"
                >
                    Завершить звонок
                </button>
            </div>
        );
    }

    // Если анкеты в базе просмотрены или отсутствуют
    if (candidates.length === 0 || currentIndex >= candidates.length) {
        return (
            <div className="w-full space-y-4">
                {/* Убрали верхний статичный плакат с призывом */}
                <AIPairMatching userId={userId} />
            </div>
        );
    }

    const current = candidates[currentIndex];

    return (
        <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-5 shadow-2xl text-white mx-auto my-4 space-y-4">

            {/* Шапка карточки */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                    <h3 className="font-bold text-lg text-amber-400">{current.display_name}</h3>
                    <p className="text-xs text-slate-400">📍 {current.location}</p>
                </div>
                <button
                    onClick={() => handleIgnore(current.id)}
                    className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                >
                    🚫 Игнорировать
                </button>
            </div>

            {/* Данные анкеты */}
            <div className="space-y-2 text-xs">
                <div className="bg-[#070a12] p-3 rounded-xl">
                    <span className="text-slate-500 font-bold block mb-0.5">Жизненный путь</span>
                    <p className="text-slate-200">{current.about_me || 'Не заполнено'}</p>
                </div>
                <div className="bg-[#070a12] p-3 rounded-xl">
                    <span className="text-slate-500 font-bold block mb-0.5">Религия и обязанности</span>
                    <p className="text-slate-200">{current.religious_practise || 'Не заполнено'}</p>
                </div>
                <div className="bg-[#070a12] p-3 rounded-xl">
                    <span className="text-slate-500 font-bold block mb-0.5">Взгляд на брак</span>
                    <p className="text-slate-200">{current.family_values || 'Не заполнено'}</p>
                </div>
            </div>

            {/* Поле быстрого сообщения */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-[11px] text-slate-400">Напишите первое сообщение (к нему прикрепится ваша анкета):</label>
                <textarea
                    rows={2}
                    placeholder="Ассаляму алейкум, я прочитал(а) вашу анкету..."
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
            </div>

            {/* Кнопки управления */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={nextCard}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-medium transition"
                >
                    Дальше
                </button>
                <button
                    onClick={() => handleConnect(current.id)}
                    className="col-span-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-md shadow-orange-500/10"
                >
                    💌 Отправить анкету и написать
                </button>
            </div>

            {/* Кнопка-демо для тестирования видеозвонка */}
            <div className="text-center pt-2">
                <button onClick={triggerMatchSuccess} className="text-[10px] text-slate-600 hover:underline">
                    [ Симулировать взаимный клик и запуск видео-связи ]
                </button>
            </div>

        </div>
    );
}