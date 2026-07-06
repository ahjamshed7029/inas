import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface Questionnaire {
  id: string;
  display_name: string;
  about_me: string;
  religious_practise: string;
  family_values: string;
  location: string;
}

export default function SearchCard({ userId }: { userId: string }) {
  const [candidates, setCandidates] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true);

      // 1. Узнаем пол текущего пользователя
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('gender')
        .eq('id', userId)
        .single();

      if (!userProfile) return;

      const oppositeGender = userProfile.gender === 'male' ? 'female' : 'male';

      // 2. Вытаскиваем анкеты противоположного пола через связь таблиц
      const { data } = await supabase
        .from('questionnaires')
        .select(`
          id, display_name, about_me, religious_practise, family_values, location,
          profiles!inner(gender)
        `)
        .eq('profiles.gender', oppositeGender)
        .eq('is_active', true);

      if (data) {
        setCandidates(data as unknown as Questionnaire[]);
      }
      setLoading(false);
    }

    fetchCandidates();
  }, [userId]);

  const sendRequest = async (receiverId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .insert([{ sender_id: userId, receiver_id: receiverId, status: 'pending' }]);

      if (error) {
        if (error.code === '23505') alert('Вы уже отправили запрос этому кандидату!');
        else throw error;
      } else {
        alert('Запрос на знакомство отправлен. Ожидайте взаимного отклика у костра.');
        nextCard();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) return <div className="text-center py-10 text-slate-400 text-sm">Ищем путников у костра...</div>;
  if (currentIndex >= candidates.length) return <div className="text-center py-10 text-slate-400 text-sm">Вы просмотрели все доступные анкеты.</div>;

  const current = candidates[currentIndex];

  return (
    <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white mx-auto my-4 space-y-5">

      {/* Шапка карточки */}
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
        <div>
          <h4 className="font-bold text-base text-amber-400">{current.display_name}</h4>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            📍 {current.location}
          </span>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold">
          Адаб: 85
        </div>
      </div>

      {/* Текстовые блоки с ценностями */}
      <div className="space-y-3 text-xs leading-relaxed">
        <div className="bg-[#070a12] p-3 rounded-xl border border-slate-900">
          <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">О себе</span>
          <p className="text-slate-300">{current.about_me || 'Не указано'}</p>
        </div>

        <div className="bg-[#070a12] p-3 rounded-xl border border-slate-900">
          <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Религия</span>
          <p className="text-slate-300">{current.religious_practise || 'Не указано'}</p>
        </div>

        <div className="bg-[#070a12] p-3 rounded-xl border border-slate-900">
          <span className="text-slate-500 font-bold uppercase tracking-wider block mb-1">Семья</span>
          <p className="text-slate-300">{current.family_values || 'Не указано'}</p>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <button
          onClick={nextCard}
          className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition text-xs"
        >
          Пропустить
        </button>
        <button
          onClick={() => sendRequest(current.id)}
          className="col-span-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-xl transition text-xs shadow-md shadow-orange-500/10 active:scale-95"
        >
          🤝 Отозваться
        </button>
      </div>

    </div>
  );
}