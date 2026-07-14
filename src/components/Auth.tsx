import { useState } from 'react';
import { supabase } from '../lib/supabase';

// 1. Словарь переводов соглашения для всех 6 языков проекта
const agreementTranslations = {
    ru: {
        agreeText: "Регистрируясь, вы соглашаетесь с",
        terms: "Условиями использования",
        and: "и",
        privacy: "Политикой конфиденциальности"
    },
    kk: {
        agreeText: "Тіркелу арқылы сіз",
        terms: "Пайдалану шарттарымен",
        and: "және",
        privacy: "Құпиялылық саясатымен келісесіз"
    },
    uz: {
        agreeText: "Roʻyxatdan oʻtish orqali siz",
        terms: "Foydalanish shartlari",
        and: "va",
        privacy: "Maxfiylik siyosatiga rozilik bildirasiz"
    },
    tg: {
        agreeText: "Бо сабти ном, шумо ба",
        terms: "Шартҳои истифода",
        and: "ва",
        privacy: "Сиёсати махфият розӣ мешавед"
    },
    ky: {
        agreeText: "Катталуу менен сиз",
        terms: "Колдонуу шарттарына",
        and: "жана",
        privacy: "Купуялык саясатына макулдугуңузду билдиресиз"
    },
    tk: {
        agreeText: "Agza bolmak bilen, siz",
        terms: "Ulanyş şertleri",
        and: "we",
        privacy: "Gizlinlik syýasaty bilen ylalaşýarsyňyz"
    }
};

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Дополнительные поля для создания профиля при регистрации
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

    // Динамически получаем выбранный в приложении язык (или ставим 'ru' по умолчанию)
    const currentLang = localStorage.getItem('lang') || 'ru';
    const t = agreementTranslations[currentLang as keyof typeof agreementTranslations] || agreementTranslations.ru;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                // 1. Регистрация в Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (authError) throw authError;

                if (authData?.user) {
                    // 2. Создание записи в таблице profiles
                    const { error: profileError } = await supabase.from('profiles').insert({
                        id: authData.user.id,
                        name: name || 'Пользователь',
                        gender: gender,
                        age: age ? parseInt(age) : null,
                        created_at: new Date().toISOString(),
                    });

                    if (profileError) throw profileError;

                    setMessage({ text: 'Регистрация успешна! Добро пожаловать.', type: 'success' });
                }
            } else {
                // Вход в систему
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (err: any) {
            setMessage({ text: err.message || 'Произошла ошибка', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 selection:bg-amber-500/30">
            {/* Декоративное фоновое свечение */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#0f172a]/70 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10">

                {/* Логотип и заголовок */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-600/20 text-2xl mb-4">
                        ⚜️
                    </div>
                    <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                        {isSignUp ? 'Создание очага' : 'Войти к очагу'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-tight">
                        Платформа искренних семейных ценностей «Инас»
                    </p>
                </div>

                {/* Сообщения об ошибках или успехе */}
                {message && (
                    <div className={`p-3.5 rounded-xl text-xs font-medium mb-5 text-center border ${message.type === 'error'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                        {message.type === 'error' ? '🛑 ' : '✨ '}
                        {message.text}
                    </div>
                )}

                {/* Форма */}
                <form onSubmit={handleAuth} className="space-y-4">

                    {isSignUp && (
                        <>
                            {/* Поле Имя (только при регистрации) */}
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Ваше имя</label>
                                <input
                                    type="text"
                                    placeholder="Например, Амир или Амина"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-[#070a13]/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                                />
                            </div>

                            {/* Выбор Пола */}
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Ваш пол</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setGender('male')}
                                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${gender === 'male'
                                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-inner'
                                            : 'bg-[#070a13]/40 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        🙋‍♂️ Мужской
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setGender('female')}
                                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${gender === 'female'
                                            ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-inner'
                                            : 'bg-[#070a13]/40 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        🙋‍♀️ Женский
                                    </button>
                                </div>
                            </div>

                            {/* Поле Возраст */}
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Возраст</label>
                                <input
                                    type="number"
                                    placeholder="Лет"
                                    min="18"
                                    max="99"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    className="w-full bg-[#070a13]/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                                />
                            </div>
                        </>
                    )}

                    {/* Поле Почта */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Электронная почта</label>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#070a13]/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                        />
                    </div>

                    {/* Поле Пароль */}
                    <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Пароль</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#070a13]/80 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                        />
                    </div>

                    {/* ТЕКСТ СОГЛАШЕНИЯ (Рендерится строго НАД кнопкой и только при Регистрации) */}
                    {isSignUp && (
                        <div className="text-center text-[11px] text-slate-400/80 mt-3 px-2 leading-relaxed selection:bg-amber-500/10">
                            {t.agreeText}{' '}
                            <a href="/terms" className="text-amber-400/90 hover:text-amber-300 hover:underline transition font-medium">
                                {t.terms}
                            </a>{' '}
                            {t.and}{' '}
                            <a href="/privacy" className="text-amber-400/90 hover:text-amber-300 hover:underline transition font-medium">
                                {t.privacy}
                            </a>
                        </div>
                    )}

                    {/* Кнопка действия */}
                    <button
                        type="submit"
                        disabled={loading || (isSignUp && !isAgreed)}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm shadow-xl shadow-amber-600/10 active:scale-[0.99] transition disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Сверение с базой...' : (isSignUp ? 'Зажечь очаг' : 'Войти')}
                    </button>
                </form>

                {/* {/* Переключение Вход / Регистрация */}
                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage(null);
                        }}
                        className="text-xs font-medium text-slate-400 hover:text-amber-400 transition"
                    >
                        {isSignUp ? 'Есть аккаунт? Войти' : 'Нет аккаунта? Создать очаг'}
                    </button>
                </div>

               {/* БЛОК СОГЛАСИЯ И БЕЗОПАСНОСТИ ПЛАТЕЖЕЙ (Рендерится только при Регистрации) */}
                {isSignUp && (
                    <div className="mt-5 pt-4 border-t border-slate-800/60 selection:bg-amber-500/10">
                        {/* Чекбокс согласия над юридическим текстом */}
                        <div className="flex items-start gap-3 mb-3 px-1 text-left">
                            <input 
                                id="terms-checkbox"
                                type="checkbox" 
                                checked={isAgreed} 
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="w-4 h-4 mt-0.5 accent-amber-500 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 cursor-pointer"
                            />
                            <label htmlFor="terms-checkbox" className="text-[11px] text-slate-400/80 leading-relaxed cursor-pointer select-none">
                                {t.agreeText}{' '}
                                <a href="/terms" className="text-amber-400/90 hover:text-amber-300 hover:underline transition font-medium">
                                    {t.terms}
                                </a>{' '}
                                {t.and}{' '}
                                <a href="/privacy" className="text-amber-400/90 hover:text-amber-300 hover:underline transition font-medium">
                                    {t.privacy}
                                </a>
                            </label>
                        </div>

                        {/* Финансовая безопасность для платежных систем */}
                        <div className="p-3 rounded-xl border border-red-500/15 bg-red-500/5 text-[10.5px] text-slate-300 leading-relaxed text-left">
                            <span className="font-bold text-red-400 block mb-1 text-center">🛡️ Безопасность и контроль платежей</span>
                            Любые денежные переводы или сборы средств между пользователями категорически запрещены. При попытке мошенничества или вымогательства немедленно отправьте жалобу на почту техподдержки: <span className="text-amber-400 font-medium underline">support@inas-eta.vercel.app</span>
                        </div>
                    </div>
                )}
            </div>
         
        </div>
    );
}