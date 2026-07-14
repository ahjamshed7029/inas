import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useTranslation } from 'react-i18next'; // Импортируем хук перевода
import Auth from './components/Auth';
import Recommendations from './components/Recommendations';
import { AdabHub } from './components/AdabHub';
import ChatList from './components/ChatList';
import ActiveChat from './components/ActiveChat';
import EditProfile from './components/EditProfile';
import AIChatWidget from './components/AIChatWidget';

type TabType = 'search' | 'adab' | 'chats' | 'profile';

export default function App() {
  const { t, i18n } = useTranslation(); // t — функция перевода, i18n — объект управления
  const [session, setSession] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('adab');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserGender(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserGender(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserGender(userId: string) {
    const { data } = await supabase.from('profiles').select('gender').eq('id', userId).single();
    if (data) {
      setUserGender(data.gender);
    }
  }

  // Функция смены языка
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-200 flex flex-col antialiased select-none">

      {/* Шапка приложения */}
      <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-40 px-4 py-3.5">
        <div className="max-w-md mx-auto flex justify-between items-center gap-2">

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xl flex-shrink-0">🔥</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent tracking-wide truncate">
              إيناس
            </h1>
          </div>

          {/* Селектор выбора языка */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={i18n.language.split('-')[0]} // берем чистый код языка (например, 'uz' из 'uz-UZ')
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-slate-800/80 text-slate-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 border border-slate-700/60 focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              <option value="uz">Oʻzb</option>
              <option value="kk">Қаз</option>
              <option value="tg">Тоҷ</option>
              <option value="ky">Кыр</option>
              <option value="tk">Tür</option>
              <option value="ru">Рус</option>
            </select>

            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs font-medium text-rose-400/80 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all"
            >
              {t('logout')}
            </button>
          </div>

        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-32">
        {activeChatId ? (
          <div className="space-y-4">
            <button
              onClick={() => { setActiveChatId(null); setCurrentTab('chats'); }}
              className="inline-flex items-center text-xs font-semibold text-amber-400 hover:text-amber-300 transition gap-1 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10"
            >
              ← {t('chats')}
            </button>
            <ActiveChat
              userId={session.user.id}
              userGender={userGender}
            />
          </div>
        ) : (
          <div className="bg-[#0f172a]/40 border border-slate-800/50 rounded-3xl p-4 backdrop-blur-sm min-h-[55vh] shadow-xl">
            {/* ВОЗВРАЩАЕМ КАК БЫЛО */}
            {currentTab === 'search' && <Recommendations userId={session.user.id} />}
            {currentTab === 'adab' && <AdabHub />}

            {currentTab === 'chats' && (
              <ChatList
                userId={session.user.id}
                onSelectChat={(id) => setActiveChatId(id)}
              />
            )}
            {currentTab === 'profile' && <EditProfile userId={session.user.id} />}
          </div>
        )}
      </main>

      {/* ИИ-Наставник Амина */}
      <AIChatWidget userId={session.user.id} />

      {/* Обновленный Таббар */}
      <nav className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="max-w-md mx-auto bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] grid grid-cols-4 gap-2">

          {/* Кнопка: Никах */}
          <button
            onClick={() => { setCurrentTab('search'); setActiveChatId(null); }}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300 ${
              currentTab === 'search'
                ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/5 border border-amber-500/30 text-amber-400 font-bold scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xl">🔍</span>
            <span className="text-[12px] truncate max-w-full px-1">{t('search')}</span>
          </button>

          {/* Кнопка: Адаб */}
          <button
            onClick={() => { setCurrentTab('adab'); setActiveChatId(null); }}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300 relative ${currentTab === 'adab'
              ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/5 border border-amber-500/30 text-amber-400 font-bold scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <span className="text-xl">✨</span>
            <span className="text-[12px] truncate max-w-full px-1">{t('adab')}</span>
            {currentTab === 'adab' && (
              <span className="absolute top-1.5 right-5 w-1 h-1 bg-amber-400 rounded-full animate-ping"></span>
            )}
          </button>

          {/* Кнопка: Беседы */}
          <button
            onClick={() => { setCurrentTab('chats'); setActiveChatId(null); }}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300 ${currentTab === 'chats'
              ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/5 border border-amber-500/30 text-amber-400 font-bold scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <span className="text-xl">💬</span>
            <span className="text-[12px] truncate max-w-full px-1">{t('chats')}</span>
          </button>

          {/* Кнопка: Меню */}
          <button
            onClick={() => { setCurrentTab('profile'); setActiveChatId(null); }}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300 ${currentTab === 'profile'
              ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/5 border border-amber-500/30 text-amber-400 font-bold scale-[1.02]'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <span className="text-xl">📝</span>
            <span className="text-[12px] truncate max-w-full px-1">{t('menu')}</span>
          </button>

        </div>
      </nav>

    </div>
  );
}