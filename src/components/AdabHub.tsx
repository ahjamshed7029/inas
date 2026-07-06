import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Тематические категории для фильтрации контента
const categories = [
    { id: 'all', name: 'Всё' },
    { id: 'family', name: 'Семья и никях' },
    { id: 'adab', name: 'Правила этикета (Адаб)' },
    { id: 'parenting', name: 'Воспитание детей' },
    { id: 'traditions', name: 'Традиции и ценности' }
];

export default function AdabCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    return (
        <div className="w-full max-w-md mx-auto px-4 pt-4 pb-28 text-slate-200">

            {/* 1. СТРОКА ПОИСКА СТАТЕЙ */}
            <div className="relative mb-5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 text-base">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="Поиск статей, контента, советов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#070a13]/90 border border-slate-800/80 focus:border-amber-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 text-xs"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* 2. ГОРИЗОНТАЛЬНЫЙ ФИЛЬТР ПО ИНТЕРЕСУЮЩИМ ТЕМАМ */}
            <div className="mb-6">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 ml-1">
                    Интересующие темы
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 text-xs font-medium rounded-xl border whitespace-nowrap transition-all snap-start ${selectedCategory === category.id
                                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-md'
                                    : 'bg-[#0f172a]/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                                }`}
                        >
                            {category.id === 'all' ? '📚 ' : '▪️ '}
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Блок контента (сюда пойдет ваш отфильтрованный список статей из Supabase) */}
            <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium ml-1">
                    {searchQuery ? `Результаты по запросу «${searchQuery}»:` : 'Рекомендованные материалы:'}
                </p>
                {/* Здесь будет рендериться ваш массив статей */}
            </div>

        </div>
    );
}
interface Vendor {
    id: string;
    categoryId: string;
    name: string;
    rating: number;
    reviewsCount: number;
    description: string;
    priceKey: string; // Изменили на ключ локализации для гибкости валют/цен
    imageColor: string;
    isHalalCertified?: boolean;
    features: string[];
}

interface Post {
    id: string;
    author: string;
    gender: 'male' | 'female';
    timeKey: string; // Ключ для времени (например, time_2h, time_yesterday)
    text: string;    // Текст автора (остается оригинальным)
    likes: number;
    comments: number;
    isLiked?: boolean;
}

export function AdabHub() {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<'services' | 'health' | 'creative'>('services');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>('');

    // Состояния для ИИ-здоровья
    const [aiUserType, setAiUserType] = useState<'male' | 'female' | 'pregnant' | 'kids'>('male');
    const [aiGoal, setAiGoal] = useState<'nutrition' | 'fitness' | 'sharia'>('nutrition');
    const [aiLoading, setAiLoading] = useState<boolean>(false);
    const [aiResult, setAiResult] = useState<any | null>(null);

    // Состояния для Творчества
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [newPostText, setNewPostText] = useState('');
    const [posts, setPosts] = useState<Post[]>([
        {
            id: '1',
            author: 'Абдуллах',
            gender: 'male',
            timeKey: 'time_2h',
            text: '«Семья — не просто спутник дней земных,\nОна — корабль в бушующем потоке.\nХраните Адаб в действиях своих,\nИ обретете мир в Его пророке...»',
            likes: 42,
            comments: 5,
            isLiked: false
        },
        {
            id: '2',
            author: 'Марьям',
            gender: 'female',
            timeKey: 'time_yesterday',
            text: 'Альхамдулиллях, сегодня завершила чтение прекрасной книги о воспитании детей в исламе. Самый главный вывод — дети копируют наше поведение, а не наши слова. Начните праведность с себя.',
            likes: 89,
            comments: 12,
            isLiked: true
        }
    ]);

    // Структурированные категории (тексты вынесены в i18n ключи)
    const servicesCategories = {
        wedding: [
            { id: 'rent', titleKey: 'cat_rent', icon: '👗', count: 12 },
            { id: 'tailor', titleKey: 'cat_tailor', icon: '🪡', count: 8 },
            { id: 'rest', titleKey: 'cat_rest', icon: '🍽️', count: 19 },
            { id: 'tamada', titleKey: 'cat_tamada', icon: '🎤', count: 5 },
            { id: 'decor', titleKey: 'cat_decor', icon: '🏺', count: 7 },
            { id: 'svaha', titleKey: 'cat_svaha', icon: '🧕', count: 4 },
        ],
        lifestyle: [
            { id: 'beauty', titleKey: 'cat_beauty', icon: '✂️', count: 14 },
            { id: 'cars', titleKey: 'cat_cars', icon: '🚗', count: 9 },
            { id: 'hotels', titleKey: 'cat_hotels', icon: '🏨', count: 11 },
            { id: 'photo', titleKey: 'cat_photo', icon: '📸', count: 6 },
        ]
    };

    const vendorsData: Vendor[] = [
        {
            id: 'v1', categoryId: 'rent', name: 'Aisha Dress', rating: 4.9, reviewsCount: 48,
            description: 'Прокат благопристойных свадебных платьев для Никяха и торжеств. Закрытые фасоны, премиальные ткани.',
            priceKey: 'от 5 000 ₽ / день', imageColor: 'from-emerald-900 to-slate-900', isHalalCertified: true, features: ['Химчистка включена', 'Кабинки со шторами']
        },
        {
            id: 'v3', categoryId: 'rest', name: 'Medina Palace', rating: 5.0, reviewsCount: 124,
            description: 'Банкетный зал до 200 человек. Строго Халяль меню, полное отсутствие алкоголя.',
            priceKey: 'от 2 500 ₽ / чел', imageColor: 'from-amber-950 to-slate-900', isHalalCertified: true, features: ['Раздельные залы', 'Молельная комната']
        }
    ];

    // Динамический контент ИИ в зависимости от языка
    const simulateAIResponse = () => {
        setAiLoading(true);
        setAiResult(null);
        setTimeout(() => {
            let data = { title: '', sunna: '', medical: '', advice: '' };
            if (aiUserType === 'pregnant' && aiGoal === 'nutrition') {
                data = {
                    title: '🌙 ' + (i18n.language.startsWith('uz') ? 'Homiladorlar uchun Halol-nutritsiologiya rejasi' : 'План Халяль-нутрициологии для беременных'),
                    sunna: i18n.language.startsWith('uz') ? 'Sunnat mahsulotlari: Xurmo (ayniqsa tug\'ruqni osonlashtirish uchun so\'nggi oylarda), yangi sut, anjir va asal.' : 'Продукты Сунны: Финики (особенно в последние месяцы для облегчения родов), свежее молоко, инжир и мед.',
                    medical: i18n.language.startsWith('uz') ? 'Tibbiy tavsiyalar: Yuqori temir moddasi (qizil halol go\'sht, ismaloq), foliy kislotasi, zararli konservantlardan butunlay voz kechish.' : 'Медицинские рекомендации: Повышенное содержание железа (красное халяль-мясо, шпинат), фолиевая кислота, полный отказ от вредных консервантов.',
                    advice: i18n.language.startsWith('uz') ? 'Yashirin shakardan saqlaning. Har safar ovqatlanishdan oldin duo qilib, kam-kamdan teziroq tamaddi qiling.' : 'Избегайте скрытого сахара. Питайтесь дробно, совершая дуа перед каждым приемом пищи.'
                };
            } else if (aiUserType === 'male' && aiGoal === 'fitness') {
                data = {
                    title: '⚔️ ' + (i18n.language.startsWith('uz') ? 'Erkaklar uchun Sunnat-Fitnes majmuasi' : 'Комплекс Сунна-Фитнеса для мужчин'),
                    sunna: i18n.language.startsWith('uz') ? 'Sunnat faolliklari: Kamondan otish (qomat va diqqatni rivojlantiradi), yugurish, suzish va ot minish.' : 'Сунна-активность: Стрельба из лука (развивает осанку и концентрацию), бег, плавание и верховая езда.',
                    medical: i18n.language.startsWith('uz') ? 'Fitnes reja: Testosteronni ushlab turish uchun haftada 3 marta kuch mashqlari. Asosiy mashqlarga urg\'u berish.' : 'Фитнес-план: Силовые тренировки 3 раза в неделю для поддержания тестостерона. Упор на базовые упражнения.',
                    advice: i18n.language.startsWith('uz') ? 'Avratni yopadigan kiyimda mashq qiling. Farz namozlardan oldin qattiq charchab qolishga yo\'l qo\'ymang.' : 'Тренируйтесь в одежде, закрывающей аурат. Не допускайте переутомления перед обязательными намазами.'
                };
            } else {
                data = {
                    title: '📜 ' + (i18n.language.startsWith('uz') ? 'Shaxsiy Adab va Salomatlik qo\'llanmasi' : 'Персональный Адаб-Гайд знаний и здоровья'),
                    sunna: i18n.language.startsWith('uz') ? 'Sunnat asosi: Misvokdan foydalanish, ovqatlanishda me\'yor (oshqozonning uchdan bir qismi qoidasi), qora sedana iste\'mol qilish.' : 'Основа Сунны: Использование сивака, умеренность в еде (правило одной трети желудка), употребление черного тмина.',
                    medical: i18n.language.startsWith('uz') ? 'Sog\'lom muvozanat: Toza havoda muntazam yurish, toza suv (kamida 1.5 litr) va tezkor taomlardan (fastfud) voz kechish.' : 'Здоровый баланс: Регулярные прогулки на свежем воздухе, чистая вода (не менее 1.5л) и отказ от фастфуда.',
                    advice: i18n.language.startsWith('uz') ? 'Uxlash rejimiga rioya qiling: Xufton namozidan keyin yoting va Tahajjud / Bomdodga turing.' : 'Соблюдайте режим сна: ложитесь после Иша-намаза и вставайте на Тахаджуд / Фаджр.'
                };
            }
            setAiResult(data);
            setAiLoading(false);
        }, 1200);
    };

    // Обработка публикации поста
    const handlePublishPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostText.trim()) return;

        const newPost: Post = {
            id: Date.now().toString(),
            author: 'Вы',
            gender: 'male',
            timeKey: 'time_now',
            text: newPostText,
            likes: 0,
            comments: 0,
            isLiked: false
        };

        setPosts([newPost, ...posts]);
        setNewPostText('');
        setIsEditorOpen(false);
    };

    const handleLike = (id: string) => {
        setPosts(posts.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    isLiked: !p.isLiked,
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1
                };
            }
            return p;
        }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans select-none pb-12">

            {/* Шапка хаба */}
            <div className="text-center my-4">
                <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-amber-500 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider">
                    {t('adab_hub_title')}
                </h1>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('adab_hub_subtitle')}</p>
            </div>

            {/* Меню верхних вкладок */}
            {!selectedCategory && (
                <div className="flex p-1 bg-slate-900/80 border border-slate-800/60 rounded-2xl mb-6 shadow-2xl backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'services' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {t('tab_services')}
                    </button>
                    <button
                        onClick={() => setActiveTab('health')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'health' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {t('tab_health')}
                    </button>
                    <button
                        onClick={() => setActiveTab('creative')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'creative' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {t('tab_creative')}
                    </button>
                </div>
            )}

            {/* --- ТАБ 1: МАГАЗИН УСЛУГ --- */}
            {activeTab === 'services' && (
                <div className="animate-fadeIn">
                    {!selectedCategory ? (
                        <div className="space-y-6">
                            {/* Блок 1: Всё для Никяха */}
                            <div>
                                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 px-1">{t('sec_wedding')}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {servicesCategories.wedding.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.id); setSelectedCategoryTitle(t(cat.titleKey)); }}
                                            className="bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 p-3 rounded-2xl text-left transition-all flex items-center gap-3 group"
                                        >
                                            <div className="text-xl bg-slate-950 p-2 rounded-xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-200 leading-tight">{t(cat.titleKey)}</h4>
                                                <p className="text-[9px] text-slate-500 mt-0.5">{t('offers_count', { count: cat.count })}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Блок 2: Бытовые */}
                            <div>
                                <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 px-1">{t('sec_lifestyle')}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {servicesCategories.lifestyle.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.id); setSelectedCategoryTitle(t(cat.titleKey)); }}
                                            className="bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 p-3 rounded-2xl text-left transition-all flex items-center gap-3 group"
                                        >
                                            <div className="text-xl bg-slate-950 p-2 rounded-xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-200 leading-tight">{t(cat.titleKey)}</h4>
                                                <p className="text-[9px] text-slate-500 mt-0.5">{t('offers_count', { count: cat.count })}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <button onClick={() => setSelectedCategory(null)} className="bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-xl">
                                    {t('btn_back')}
                                </button>
                                <h2 className="text-sm font-bold text-amber-400">{selectedCategoryTitle}</h2>
                            </div>
                            {vendorsData.filter(v => v.categoryId === selectedCategory).map((vendor) => (
                                <div key={vendor.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-2">
                                    <h3 className="text-sm font-bold text-white">{vendor.name}</h3>
                                    <p className="text-[11px] text-slate-400">{vendor.description}</p>
                                    <button className="w-full bg-slate-950 border border-amber-500/30 text-amber-400 font-bold text-xs py-2 rounded-xl">
                                        {t('btn_book')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- ТАБ 2: ПОЛЬЗА И ЗДОРОВЬЕ --- */}
            {activeTab === 'health' && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/20 p-4 rounded-2xl shadow-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                            <span className="text-lg">🤖</span>
                            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">{t('ai_title')}</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">{t('ai_profile_label')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'male', label: '🧔 ' + (i18n.language.startsWith('uz') ? 'Erkaklarga' : 'Мужчинам') },
                                    { id: 'female', label: '🧕 ' + (i18n.language.startsWith('uz') ? 'Ayollarga' : 'Женщинам') },
                                    { id: 'pregnant', label: '🤰 ' + (i18n.language.startsWith('uz') ? 'Homiladorlarga' : 'Беременным') },
                                    { id: 'kids', label: '👶 ' + (i18n.language.startsWith('uz') ? 'Bolalarga' : 'Детям') }
                                ].map((item) => (
                                    <button key={item.id} onClick={() => setAiUserType(item.id as any)} className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left ${aiUserType === item.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>{item.label}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">{t('ai_dir_label')}</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { id: 'nutrition', label: '🥦 ' + (i18n.language.startsWith('uz') ? 'Taomlanish' : 'Питание') },
                                    { id: 'fitness', label: '🏃‍♂️ ' + (i18n.language.startsWith('uz') ? 'Sport' : 'Спорт') },
                                    { id: 'sharia', label: '🕌 ' + (i18n.language.startsWith('uz') ? 'Shariat' : 'Шариат') }
                                ].map((item) => (
                                    <button key={item.id} onClick={() => setAiGoal(item.id as any)} className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold border transition-all ${aiGoal === item.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>{item.label}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={simulateAIResponse} disabled={aiLoading} className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-slate-950 text-xs font-black py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                            {aiLoading ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full"></span>{t('ai_loading')}</> : t('ai_btn_generate')}
                        </button>
                    </div>
                    {aiResult && (
                        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl shadow-xl space-y-3 animate-fadeIn">
                            <h3 className="text-xs font-bold text-amber-400 border-b border-slate-800 pb-1.5">{aiResult.title}</h3>
                            <div className="space-y-2.5 text-[11px] leading-relaxed">
                                <div><span className="font-bold text-emerald-400 block mb-0.5">{t('ai_sec_sunna')}</span><p className="text-slate-300">{aiResult.sunna}</p></div>
                                <div><span className="font-bold text-blue-400 block mb-0.5">{t('ai_sec_med')}</span><p className="text-slate-300">{aiResult.medical}</p></div>
                                <div className="bg-slate-950/60 p-2.5 border border-slate-800/40 rounded-xl"><span className="font-bold text-amber-500 block mb-0.5">{t('ai_sec_advice')}</span><p className="text-slate-400 italic">{aiResult.advice}</p></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- ТАБ 3: ТВОРЧЕСТВО --- */}
            {activeTab === 'creative' && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest">{t('creative_title')}</h3>
                        <button
                            onClick={() => setIsEditorOpen(!isEditorOpen)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black px-3 py-2 rounded-xl transition-all shadow-md"
                        >
                            {isEditorOpen ? t('btn_editor_close') : t('btn_editor_open')}
                        </button>
                    </div>

                    {isEditorOpen && (
                        <form onSubmit={handlePublishPost} className="bg-slate-900 border border-amber-500/20 p-4 rounded-2xl shadow-xl space-y-3 animate-slideDown">
                            <div className="text-[10px] text-amber-400/80 font-medium flex items-center gap-1.5 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                                <span>⚠️</span>
                                <span>{t('creative_warn')}</span>
                            </div>
                            <textarea
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder={t('creative_placeholder')}
                                rows={4}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 resize-none focus:outline-none focus:border-amber-500/50 placeholder-slate-600"
                            />
                            <button
                                type="submit"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black py-2.5 rounded-xl transition-all shadow-md"
                            >
                                {t('btn_publish')}
                            </button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${post.gender === 'female' ? 'bg-pink-900/50' : 'bg-blue-900/50'}`}>
                                        {post.gender === 'female' ? '🧕' : '🧔'}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-200">{post.author}</p>
                                        <p className="text-[9px] text-slate-600">{t(post.timeKey)}</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">{post.text}</p>
                                <div className="flex items-center gap-4 pt-1">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-1.5 text-[10px] font-bold transition-all ${post.isLiked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <span>{post.isLiked ? '❤️' : '🤍'}</span>
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-all">
                                        <span>💬</span>
                                        <span>{post.comments}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}