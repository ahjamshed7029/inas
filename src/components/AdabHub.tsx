import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Vendor {
    id: string;
    categoryId: string;
    name: string;
    rating: number;
    reviewsCount: number;
    description: string;
    priceKey: string;
    imageColor: string;
    isHalalCertified?: boolean;
    features: string[];
    distanceKm: number; // Расстояние до пользователя в км
}

interface Post {
    id: string;
    author: string;
    gender: 'male' | 'female';
    timeKey: string;
    text: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
}

export default function AdabHub() {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<'services' | 'health' | 'creative'>('services');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>('');

    // Состояния для ИИ-наставника
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
        }
    ]);

    const servicesCategories = {
        wedding: [
            { id: 'rent', titleKey: 'cat_rent', icon: '👗', count: 12 },
            { id: 'tailor', titleKey: 'cat_tailor', icon: '🪡', count: 8 },
            { id: 'rest', titleKey: 'cat_rest', icon: '🍽️', count: 19 },
            { id: 'tamada', titleKey: 'cat_tamada', icon: '🎤', count: 5 }
        ],
        lifestyle: [
            { id: 'beauty', titleKey: 'cat_beauty', icon: '✂️', count: 14 },
            { id: 'cars', titleKey: 'cat_cars', icon: '🚗', count: 9 }
        ]
    };

    // Данные объявлений с учетом расстояния (добавлено расстояние distanceKm)
    const vendorsData: Vendor[] = [
        {
            id: 'v1', categoryId: 'rent', name: 'Aisha Dress', rating: 4.9, reviewsCount: 48,
            description: 'Прокат благопристойных свадебных платьев для Никяха и торжеств. Закрытые фасоны, премиальные ткани.',
            priceKey: 'от 5 000 ₽ / день', imageColor: 'from-emerald-900 to-slate-900', isHalalCertified: true, features: ['Химчистка включена'],
            distanceKm: 4.2 // Совсем рядом
        },
        {
            id: 'v2', categoryId: 'rent', name: 'Al-Barakat Clothes', rating: 4.7, reviewsCount: 15,
            description: 'Мужские костюмы на никях и прокат чапанов.',
            priceKey: 'от 4 000 ₽ / день', imageColor: 'from-blue-900 to-slate-900', isHalalCertified: true, features: ['Подгонка по фигуре'],
            distanceKm: 48.0 // На окраине, входит в радиус 50 км
        },
        {
            id: 'v3', categoryId: 'rest', name: 'Medina Palace', rating: 5.0, reviewsCount: 124,
            description: 'Банкетный зал до 200 человек. Строго Халяль меню, полное отсутствие алкоголя.',
            priceKey: 'от 2 500 ₽ / чел', imageColor: 'from-amber-950 to-slate-900', isHalalCertified: true, features: ['Раздельные залы', 'Молельная комната'],
            distanceKm: 12.5
        },
        {
            id: 'v4', categoryId: 'rest', name: 'Eco Halal Rest (Далекий)', rating: 4.2, reviewsCount: 8,
            description: 'Загородный ресторан семейного типа.',
            priceKey: 'от 3 000 ₽ / чел', imageColor: 'from-gray-950 to-slate-900', isHalalCertified: true, features: ['Детская площадка'],
            distanceKm: 120.0 // Слишком далеко, отфильтруется (больше 50 км)
        }
    ];

    const simulateAIResponse = () => {
        setAiLoading(true);
        setAiResult(null);

        setTimeout(() => {
            const currentLang = i18n.language.startsWith('uz') ? 'uz' : 'ru';
            const responses: Record<string, Record<string, { title: string; sunna: string; medical: string; advice: string }>> = {
                uz: {
                    'pregnant_nutrition': {
                        title: '🌙 Homiladorlar uchun Halol-nutritsiologiya rejasi',
                        sunna: 'Sunnat mahsulotlari: Xurmo, yangi sut, anjir va asal.',
                        medical: 'Tibbiy tavsiyalar: Yuqori temir moddasi, foliy kislotasi.',
                        advice: 'Yashirin shakardan saqlaning. Har safar ovqatlanishdan oldin duo qiling.'
                    },
                    'default': {
                        title: '📜 Shaxsiy Adab va Salomatlik qo\'llanmasi',
                        sunna: 'Sunnat asosi: Misvokdan foydalanish, ovqatlanishda me\'yor.',
                        medical: 'Sog\'lom muvozanat: Toza havoda muntazam yurish, toza suv.',
                        advice: 'Uxlash rejimiga rioya qiling: Xufton namozidan keyin yoting.'
                    }
                },
                ru: {
                    'pregnant_nutrition': {
                        title: 'План Халяль-нутрициологии для беременных',
                        sunna: 'Продукты Сунны: Финики, свежее молоко, инжир и мед.',
                        medical: 'Медицинские рекомендации: Повышенное содержание железа, фолиевая кислота.',
                        advice: 'Избегайте скрытого сахара. Питайтесь дробно, совершая дуа.'
                    },
                    'default': {
                        title: 'Персональный Адаб-Гайд знаний и здоровья',
                        sunna: 'Основа Сунны: Использование сивака, умеренность в еде.',
                        medical: 'Здоровый баланс: Регулярные прогулки на свежем воздухе.',
                        advice: 'Соблюдайте режим сна: ложитесь после Иша-намаза.'
                    }
                }
            };

            const langData = responses[currentLang] || responses['ru'];
            const responseKey = `${aiUserType}_${aiGoal}`;
            const finalData = langData[responseKey] || langData['default'];

            setAiResult(finalData);
            setAiLoading(false);
        }, 1200);
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 pt-4 pb-28 text-slate-200 select-none bg-slate-950 min-h-screen">

            {/* ШАПКА ХАБА */}
            <div className="text-center my-2">
                <h1 className="text-xl font-black bg-gradient-to-r from-amber-300 via-amber-500 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider">
                    {t('adab_hub_title', { defaultValue: 'ADAB MARKAZI' })}
                </h1>
            </div>

            {/* Сквозной глобальный поиск — теперь ВСЕГДА виден на любой вкладке */}
            <div className="relative mb-4 mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 text-sm">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder={t('search_placeholder', { defaultValue: 'Поиск контента, услуг и объявлений...' })}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#070a13]/90 border border-slate-800 focus:border-amber-500/50 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all shadow-inner"
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

            {/* Переключатель вкладок */}
            <div className="flex p-1 bg-slate-900/80 border border-slate-800/60 rounded-2xl mb-5 shadow-2xl backdrop-blur-md">
                <button
                    onClick={() => { setActiveTab('services'); setSelectedCategory(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'services' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {t('tab_services', { defaultValue: 'Xizmatlar' })}
                </button>
                <button
                    onClick={() => setActiveTab('health')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'health' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {t('tab_health', { defaultValue: 'Salomatlik' })}
                </button>
                <button
                    onClick={() => setActiveTab('creative')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'creative' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {t('tab_creative', { defaultValue: 'Ijodkorlik' })}
                </button>
            </div>

            {/* --- ТАБ 1: МАГАЗИН УСЛУГ (ОБЪЯВЛЕНИЯ В РАДИУСЕ 50 КМ) --- */}
            {activeTab === 'services' && (
                <div className="animate-fadeIn">
                    {!selectedCategory ? (
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2.5 px-1">{t('sec_wedding', { defaultValue: 'Семья и Свадьба' })}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {servicesCategories.wedding.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { setSelectedCategory(cat.id); setSelectedCategoryTitle(t(cat.titleKey, { defaultValue: cat.id })); }}
                                            className="bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 p-3 rounded-2xl text-left transition-all flex items-center gap-3 group"
                                        >
                                            <div className="text-lg bg-slate-950 p-2 rounded-xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-200 leading-tight">{t(cat.titleKey, { defaultValue: cat.id })}</h4>
                                                <p className="text-[9px] text-slate-500 mt-0.5">{t('offers_count', { count: cat.count, defaultValue: `${cat.count} предл.` })}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                                <button onClick={() => setSelectedCategory(null)} className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 px-3 py-1 rounded-xl">
                                    ← {t('btn_back', { defaultValue: 'Назад' })}
                                </button>
                                <div className="text-right">
                                    <h2 className="text-xs font-bold text-amber-400">{selectedCategoryTitle}</h2>
                                    <p className="text-[9px] text-emerald-500 font-semibold">📍 Локация: в радиусе 50 км</p>
                                </div>
                            </div>

                            {/* Список объявлений с фильтрацией до 50 км и по поисковой строке */}
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
                                {vendorsData
                                    .filter(v => v.categoryId === selectedCategory)
                                    .filter(v => v.distanceKm <= 50) // Строгий фильтр 50 км
                                    .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((vendor) => (
                                        <div key={vendor.id} className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2 relative">
                                            <span className="absolute top-3 right-3 text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                                                ⚡ {vendor.distanceKm} км от вас
                                            </span>
                                            <div className="pr-20">
                                                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                                                    {vendor.name}
                                                    {vendor.isHalalCertified && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-md border border-emerald-500/20">HALAL</span>}
                                                </h3>
                                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{vendor.description}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                                                <span className="text-[10px] font-bold text-amber-400">{vendor.priceKey}</span>
                                                <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl transition-all">
                                                    {t('btn_book', { defaultValue: 'Заказать' })}
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                {vendorsData.filter(v => v.categoryId === selectedCategory && v.distanceKm <= 50).length === 0 && (
                                    <p className="text-center text-xs text-slate-600 py-6">В радиусе 50 км ничего не найдено.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- ТАБ 2: ПОЛЬЗА И ЗДОРОВЬЕ (ИИ НАСТАВНИК) --- */}
            {activeTab === 'health' && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/20 p-4 rounded-2xl shadow-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                            <span className="text-base">🤖</span>
                            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">{t('ai_title', { defaultValue: 'ADAB AI YORDAMCHISI' })}</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-slate-500 tracking-wider block">1. PROFILNI TANLANG:</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'male', label: `🧔 ${t('profile_male', { defaultValue: 'Erkaklarga' })}` },
                                    { id: 'female', label: `🧕 ${t('profile_female', { defaultValue: 'Ayollarga' })}` },
                                    { id: 'pregnant', label: `🤰 ${t('profile_pregnant', { defaultValue: 'Homiladorlarga' })}` },
                                    { id: 'kids', label: `👶 ${t('profile_kids', { defaultValue: 'Bolalarga' })}` }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setAiUserType(item.id as any)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left ${aiUserType === item.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black text-slate-500 tracking-wider block">2. BILIM YO'NALISHI:</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { id: 'nutrition', label: `🥦 ${t('dir_nutrition', { defaultValue: 'Taomlanish' })}` },
                                    { id: 'fitness', label: `🏃‍♂️ ${t('dir_fitness', { defaultValue: 'Sport' })}` },
                                    { id: 'sharia', label: `🕌 ${t('dir_sharia', { defaultValue: 'Shariat' })}` }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setAiGoal(item.id as any)}
                                        className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold border transition-all ${aiGoal === item.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={simulateAIResponse} disabled={aiLoading} className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-slate-950 text-xs font-black py-2.5 rounded-xl transition-all flex justify-center items-center gap-2">
                            {aiLoading ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full"></span>Загрузка...</> : 'Генерировать контент'}
                        </button>
                    </div>

                    {aiResult && (
                        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl space-y-3 animate-fadeIn">
                            <h3 className="text-xs font-bold text-amber-400 border-b border-slate-800 pb-1.5">{aiResult.title}</h3>
                            <div className="space-y-2.5 text-[11px] leading-relaxed">
                                <div><span className="font-bold text-emerald-400 block mb-0.5">Сунна:</span><p className="text-slate-300">{aiResult.sunna}</p></div>
                                <div><span className="font-bold text-blue-400 block mb-0.5">Медицинский аспект:</span><p className="text-slate-300">{aiResult.medical}</p></div>
                                <div className="bg-slate-950/60 p-2.5 border border-slate-800/40 rounded-xl"><span className="font-bold text-amber-500 block mb-0.5">Рекомендация:</span><p className="text-slate-400 italic">{aiResult.advice}</p></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- ТАБ 3: ТВОРЧЕСТВО (ИЖОДКОРЛИК) --- */}
            {activeTab === 'creative' && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest">Творческий Хаб</h3>
                        <button
                            onClick={() => setIsEditorOpen(!isEditorOpen)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all"
                        >
                            {isEditorOpen ? 'Закрыть' : 'Написать пост'}
                        </button>
                    </div>

                    {isEditorOpen && (
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 animate-slideDown">
                            <textarea
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder="Поделитесь благой мыслью или стихотворением..."
                                rows={3}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 resize-none focus:outline-none focus:border-amber-500/50"
                            />
                            <button type="button" className="w-full bg-amber-500 text-slate-950 text-xs font-black py-2 rounded-xl">
                                Опубликовать
                            </button>
                        </div>
                    )}

                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <p className="text-xs font-bold text-slate-400">{post.author}</p>
                                <p className="text-[11px] text-slate-300 whitespace-pre-line">{post.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}