import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase'; // Импортируем наш клиент Supabase

// 1. Объединяем переводы для всех 6 языков прямо в коде
const LANGUAGES_RESOURCES = {
    uz: {
        translation: {
            backToMenu: "← Menyoga qaytish",
            profileManagement: "Profilni boshqarish",
            profileSubtitle: "Hisob sozlamalari, qo'llab-quvvatlash va arizalar",
            becomePartner: "Hamkor bo'lish",
            becomePartnerDesc: "Do'konda xizmat ko'rsatish uchun ariza topshirish",
            notificationSettings: "Bildirishnoma sozlamalari",
            notificationSettingsDesc: "Xabarlar va bildirishnomalar uchun pochta",
            helpAndComplaints: "Yordam va shikoyatlar",
            helpAndComplaintsDesc: "Texnik yordam bilan bog'lanish yoki qoidabuzarlik haqida xabar berish",
            vendorRequestTitle: "Xizmat ko'rsatish uchun ariza",
            vendorRequestSubtitle: "Inas marketpleysida tasdiqlangan xizmat ko'rsatuvchi provayderga aylaning.",
            serviceCategory: "Xizmat toifasi",
            catMatchmaker: "Sovchi / Xatiblar",
            catPsychology: "Psixologiya",
            catLaw: "Nikoh / Huquq",
            catCelebration: "Tantanalar",
            serviceScale: "Ko'rsatilayotgan xizmat ko'lami",
            scaleCity: "Shahar (Bitta shahar miqyosida)",
            scaleRegional: "Viloyat miqyosida",
            scaleFederal: "Respublika miqyosida",
            scaleInternational: "Xalqaro (Onlayn)",
            qualificationLabel: "Malaka tavsifi, manzil va aloqa ma'lumotlari",
            qualificationPlaceholder: "Ish tajribasi, ish manzili, telefon raqamini ko'rsating...",
            sending: "Yuborilmoqda...",
            saving: "Saqlanmoqda...",
            submitVendorBtn: "Arizani moderatorlarga yuborish",
            emailSettingsSubtitle: "Tezkor bildirishnomalarni olish uchun Email manzilini ko'rsating.",
            notificationEmail: "Xabarlar uchun pochta",
            saveSettingsBtn: "Pochta sozlamalarini saqlash",
            supportService: "Qo'llab-quvvatlash xizmati",
            supportSubtitle: "Texnik nosozlik yoki Adab buzilishi haqida xabar bering.",
            requestType: "Murojaat turi",
            typeTech: "Texnik xato",
            typeReport: "Shikoyat / Adab",
            requestDetails: "Murojaat mazmuni",
            supportPlaceholder: "Vaziyatni batafsil tasvirlab bering...",
            submitSupportBtn: "Murojaatni yuborish",
            errLoad: "❌ Profilni yuklashda xatolik",
            errSend: "❌ Yuborishda xatolik",
            errSave: "❌ Saqlashda xatolik",
            successVendor: "✓ Ariza moderatorlarga muvaffaqiyatli yuborildi!",
            successSupport: "✓ Murojaat ko'rib chiqish uchun qabul qilindi!",
            successSettings: "✓ Pochta sozlamalari saqlandi!"
        }
    },
    ru: {
        translation: {
            backToMenu: "← Назад в меню",
            profileManagement: "Управление профилем",
            profileSubtitle: "Настройки аккаунта, поддержка и заявки",
            becomePartner: "Стать партнёром",
            becomePartnerDesc: "Подать заявку на оказание услуг в магазине",
            notificationSettings: "Настройки уведомлений",
            notificationSettingsDesc: "Почта для сообщений и оповещений",
            helpAndComplaints: "Помощь и жалобы",
            helpAndComplaintsDesc: "Связаться с техподдержкой или сообщить о нарушении",
            vendorRequestTitle: "Заявка на оказание услуг",
            vendorRequestSubtitle: "Станьте верифицированным поставщиком услуг в маркетплейсе Инас.",
            serviceCategory: "Категория услуг",
            catMatchmaker: "Сваха / Хатыбы",
            catPsychology: "Психология",
            catLaw: "Никиах / Право",
            catCelebration: "Торжества",
            serviceScale: "Масштаб оказываемой услуги",
            scaleCity: "Городской (В пределах одного города)",
            scaleRegional: "Региональный уровень",
            scaleFederal: "Федеральный масштаб",
            scaleInternational: "Международный (Онлайн)",
            qualificationLabel: "Описание квалификации, адрес и контакты",
            qualificationPlaceholder: "Укажите стаж работы, рабочий адрес, номер телефона...",
            sending: "Отправка...",
            saving: "Сохранение...",
            submitVendorBtn: "Отправить заявку модераторам",
            emailSettingsSubtitle: "Укажите Email для получения мгновенных оповещений.",
            notificationEmail: "Почта для сообщений",
            saveSettingsBtn: "Сохранить настройки почты",
            supportService: "Служба поддержки",
            supportSubtitle: "Сообщите о технической неисправности или нарушении Адаба.",
            requestType: "Тип обращения",
            typeTech: "Тех. ошибка",
            typeReport: "Жалоба / Адаб",
            requestDetails: "Суть обращения",
            supportPlaceholder: "Опишите ситуацию подробно...",
            submitSupportBtn: "Отправить обращение",
            errLoad: "❌ Ошибка загрузки профиля",
            errSend: "❌ Ошибка отправки",
            errSave: "❌ Ошибка сохранения",
            successVendor: "✓ Заявка успешно отправлена модераторам!",
            successSupport: "✓ Обращение принято в обработку!",
            successSettings: "✓ Настройки почты сохранены!"
        }
    },
    kk: {
        translation: {
            backToMenu: "← Мәзірге қайту",
            profileManagement: "Профильді басқару",
            profileSubtitle: "Тіркелгі параметрлері, қолдау және өтінімдер",
            becomePartner: "Серіктес болу",
            becomePartnerDesc: "Дүкенде қызмет көрсетуге өтінім беру",
            notificationSettings: "Хабарландыру параметрлері",
            notificationSettingsDesc: "Хабарламалар мен ескертулерге арналған пошта",
            helpAndComplaints: "Көмек және шағымдар",
            helpAndComplaintsDesc: "Техникалық қолдау қызметіне хабарласу немесе заң бұзушылық туралы хабарлау",
            vendorRequestTitle: "Қызмет көрсетуге өтінім",
            vendorRequestSubtitle: "Инас маркетплейсінде үйлестірілген қызмет көрсетуші болыңыз.",
            serviceCategory: "Қызмет санаты",
            catMatchmaker: "Жаушы / Хатибтер",
            catPsychology: "Психология",
            catLaw: "Никах / Құқық",
            catCelebration: "Салтанатты шаралар",
            serviceScale: "Көрсетілетін қызмет ауқымы",
            scaleCity: "Қалалық (Бір қала шегінде)",
            scaleRegional: "Аймақтық деңгей",
            scaleFederal: "Республикалық ауқым",
            scaleInternational: "Халықаралық (Онлайн)",
            qualificationLabel: "Біліктілік сипаттамасы, мекенжай және байланыс мәліметтері",
            qualificationPlaceholder: "Жұмыс өтілін, жұмыс мекенжайын, телефон нөмірін көрсетіңіз...",
            sending: "Жіберілуде...",
            saving: "Сақталуда...",
            submitVendorBtn: "Өтінімді модераторларға жіберу",
            emailSettingsSubtitle: "Жедел хабарландыруларды алу үшін Email көрсетіңіз.",
            notificationEmail: "Хабарламаларға арналған пошта",
            saveSettingsBtn: "Пошта параметрлерін сақтау",
            supportService: "Қолдау қызметі",
            supportSubtitle: "Техникалық қате немесе Әдеп бұзылуы туралы хабарлаңыз.",
            requestType: "Өтініш түрі",
            typeTech: "Тех. қате",
            typeReport: "Шағым / Әдеп",
            requestDetails: "Өтініш мәні",
            supportPlaceholder: "Жағдайды егжей-тегжейлі сипаттаңыз...",
            submitSupportBtn: "Өтінішті жіберу",
            errLoad: "❌ Профильді жүктеу қатесі",
            errSend: "❌ Жіберу қатесі",
            errSave: "❌ Сақтау қатесі",
            successVendor: "✓ Өтінім модераторларға сәтті жіберілді!",
            successSupport: "✓ Өтініш өңдеуге қабылданды!",
            successSettings: "✓ Пошта параметрлері сақталды!"
        }
    },
    ky: {
        translation: {
            backToMenu: "← Менюго кайтуу",
            profileManagement: "Профилди башкаруу",
            profileSubtitle: "Каттоо эсебинин жөндөөлөрү, колдоо жана билдирмелер",
            becomePartner: "Өнөктөш болуу",
            becomePartnerDesc: "Дүкөндө кызмат көрсөтүүгө билдирме берүү",
            notificationSettings: "Билдирме жөндөөлөрү",
            notificationSettingsDesc: "Каттар жана билдирмелер үчүн почта",
            helpAndComplaints: "Жардам жана даттануулар",
            helpAndComplaintsDesc: "Техникалык колдоо менен байланышуу же эреже бузууну билдирүү",
            vendorRequestTitle: "Кызмат көрсетуүгө билдирме",
            vendorRequestSubtitle: "Инас маркетплейсинде тастыкталган кызмат көрсөтүүчү болуңуз.",
            serviceCategory: "Kызмат категориясы",
            catMatchmaker: "Жуучу / Хатибдер",
            catPsychology: "Психология",
            catLaw: "Нике / Укук",
            catCelebration: "Салтанаттар",
            serviceScale: "Көрсөтүлгөн кызматтын масштабы",
            scaleCity: "Шаардык (Бир шаардын ичинде)",
            scaleRegional: "Аймактык деңгээл",
            scaleFederal: "Республикалык масштаб",
            scaleInternational: "Эл аралык (Онлайн)",
            qualificationLabel: "Квалификациянын сыпаттамасы, дарек жана байланыштар",
            qualificationPlaceholder: "Иш тажрыйбасын, жумуш дарегин, телефон номерин көрсөтүңүз...",
            sending: "Жөнөтүлүүдө...",
            saving: "Сакталууда...",
            submitVendorBtn: "Билдирмени модераторлорго жөнөтүү",
            emailSettingsSubtitle: "Тез арада билдирмелерди алуу үчүн Email көрсөтүңүз.",
            notificationEmail: "Каттар үчүн почта",
            saveSettingsBtn: "Почта жөндөөлөрүн сактоо",
            supportService: "Колдоо кызматы",
            supportSubtitle: "Техникалык ката же Адеп бузулушу тууралуу кабарлаңыз.",
            requestType: "Кайрылуунун түрү",
            typeTech: "Тех. ката",
            typeReport: "Даттануу / Адеп",
            requestDetails: "Кайрылуунун маңызы",
            supportPlaceholder: "Кырдаалды кеңири сүрөттөп бериңиз...",
            submitSupportBtn: "Кайрылууну жөнөтүү",
            errLoad: "❌ Профилди жүктөө катасы",
            errSend: "❌ Жөнөтүү катасы",
            errSave: "❌ Сактоо катасы",
            successVendor: "✓ Билдирме модераторлорго ийгиликтүү жөнөтүлдү!",
            successSupport: "✓ Кайрылуу кабыл алынды!",
            successSettings: "✓ Почта жөндөөлөрү сакталды!"
        }
    },
    tg: {
        translation: {
            backToMenu: "← Баргашт ба меню",
            profileManagement: "Идоракунии профил",
            profileSubtitle: "Танзимоти ҳисоб, дастгирӣ ва дархостҳо",
            becomePartner: "Шарик шудан",
            becomePartnerDesc: "Муроҷиат барои расонидани хидматҳо дар мағоза",
            notificationSettings: "Танзимоти огоҳиномаҳо",
            notificationSettingsDesc: "Почта барои паёмҳо ва огоҳиҳо",
            helpAndComplaints: "Ёрӣ ва шикоятҳо",
            helpAndComplaintsDesc: "Тамос бо дастгирии техникӣ ё гузориш дар бораи қоидавайронкунӣ",
            vendorRequestTitle: "Дархост барои расонидани хидмат",
            vendorRequestSubtitle: "Хидматрасони тасдиқшуда дар маркетплейси Инас шавед.",
            serviceCategory: "Категорияи хидматҳо",
            catMatchmaker: "Хаттибҳо / Тӯйхоҳон",
            catPsychology: "Психология",
            catLaw: "Никоҳ / Ҳуқуқ",
            catCelebration: "Ҷашнвораҳо",
            serviceScale: "Миқёси хидматрасонӣ",
            scaleCity: "Шаҳрӣ (Дар ҳудуди як шаҳр)",
            scaleRegional: "Сатҳи минтақавӣ",
            scaleFederal: "Миқёси ҷумҳуриявӣ",
            scaleInternational: "Байналмилалӣ (Онлайн)",
            qualificationLabel: "Тавсифи ихтисос, суроға ва тамосҳо",
            qualificationPlaceholder: "Собиқаи корӣ, суроғаи корӣ ва рақами телефонро қайд кунед...",
            sending: "Ирсол шуда истодааст...",
            saving: "Захира шуда истодааст...",
            submitVendorBtn: "Ирсоли дархост ба модераторҳо",
            emailSettingsSubtitle: "Email-ро барои гирифтани огоҳиҳои фаврӣ ворид кунед.",
            notificationEmail: "Почта барои паёмҳо",
            saveSettingsBtn: "Захираи танзимоти почта",
            supportService: "Хадамоти дастгирӣ",
            supportSubtitle: "Дар бораи хатогии техникӣ ё вайронкунии Одоб гузориш диҳед.",
            requestType: "Намуди муроҷиат",
            typeTech: "Хатои техникӣ",
            typeReport: "Шикоят / Одоб",
            requestDetails: "Мазмуни муроҷиат",
            supportPlaceholder: "Ватъиятро муфассал шарҳ диҳед...",
            submitSupportBtn: "Ирсоли муроҷиат",
            errLoad: "❌ Хатогии боркунии профил",
            errSend: "❌ Хатогии ирсол",
            errSave: "❌ Хатогии захира",
            successVendor: "✓ Дархост ба модераторҳо бомуваффақият ирсол шуд!",
            successSupport: "✓ Муроҷиат барои коркард қабул шуд!",
            successSettings: "✓ Танзимоти почта захира шуданд!"
        }
    },
    tr: {
        translation: {
            backToMenu: "← Menüye Dön",
            profileManagement: "Profil Yönetimi",
            profileSubtitle: "Hesap ayarları, destek ve başvurular",
            becomePartner: "Ortak Ol",
            becomePartnerDesc: "Mağazada hizmet sunmak için başvuru yapın",
            notificationSettings: "Bildirim Ayarları",
            notificationSettingsDesc: "Mesajlar ve uyarılar için e-posta",
            helpAndComplaints: "Yardım ve Şikayetler",
            helpAndComplaintsDesc: "Teknik destekle iletişime geçin veya ihlal bildirin",
            vendorRequestTitle: "Hizmet Sağlama Başvurusu",
            vendorRequestSubtitle: "Inas pazar yerinde doğrulanmış bir hizmet sağlayıcı olun.",
            serviceCategory: "Hizmet Kategorisi",
            catMatchmaker: "Çöpçatan / Hatibler",
            catPsychology: "Psikoloji",
            catLaw: "Nikah / Hukuk",
            catCelebration: "Kutlamalar",
            serviceScale: "Hizmet Ölçeği",
            scaleCity: "Şehir İçi (Tek bir şehir sınırlarında)",
            scaleRegional: "Bölgesel Düzey",
            scaleFederal: "Ulusal Ölçek",
            scaleInternational: "Uluslararası (Online)",
            qualificationLabel: "Yeterlilik açıklaması, adres ve iletişim bilgileri",
            qualificationPlaceholder: "Çalışma süresi, iş adresi, telefon numarası belirtin...",
            sending: "Gönderiliyor...",
            saving: "Kaydediliyor...",
            submitVendorBtn: "Başvuruyu Moderatörlere Gönder",
            emailSettingsSubtitle: "Anlık bildirimler almak için bir E-posta adresi belirtin.",
            notificationEmail: "Mesaj E-postası",
            saveSettingsBtn: "E-posta Ayarlarını Kaydet",
            supportService: "Destek Servisi",
            supportSubtitle: "Teknik bir hata veya Edep ihlali bildirin.",
            requestType: "Talep Türü",
            typeTech: "Teknik Hata",
            typeReport: "Şikayet / Edep",
            requestDetails: "Talep Detayı",
            supportPlaceholder: "Durumu detaylıca açıklayın...",
            submitSupportBtn: "Talebi Gönder",
            errLoad: "❌ Profil yükleme hatası",
            errSend: "❌ Gönderim hatası",
            errSave: "❌ Kaydetme hatası",
            successVendor: "✓ Başvuru moderatörlere başarıyla gönderildi!",
            successSupport: "✓ Talep işleme alındı!",
            successSettings: "✓ E-posta ayarları kaydedildi!"
        }
    }
};

export default function EditProfile({ userId }: { userId: string }) {
    const { t, i18n } = useTranslation();
    const [activeSection, setActiveSection] = useState<'main' | 'vendor_request' | 'support' | 'settings'>('main');

    // Стейты для форм
    const [emailNotifications, setEmailNotifications] = useState('');
    const [vendorCategory, setVendorCategory] = useState('match');
    const [vendorScale, setVendorScale] = useState('city');
    const [vendorText, setVendorText] = useState('');
    const [supportType, setSupportType] = useState('tech');
    const [supportText, setSupportText] = useState('');

    // Состояния загрузки и уведомлений
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // 2. ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ РЕСУРСОВ ПРИ МОНТИРОВАНИИ
    useEffect(() => {
        Object.entries(LANGUAGES_RESOURCES).forEach(([lang, res]) => {
            if (!i18n.hasResourceBundle(lang, 'translation')) {
                i18n.addResourceBundle(lang, 'translation', res.translation, true, true);
            }
        });
    }, [i18n]);

    // Подгружаем текущую почту пользователя при открытии настроек
    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

   async function fetchUserProfile() {
        const { data, error } = await supabase
            .from('profiles')
            .select('notification_email')
            .eq('id', userId);

        if (error) {
            setStatusMessage(`${t('errLoad')}: ${error.message}`);
            console.error(error);
            return;
        }

        // Безопасно берем первый элемент из массива данных
        if (data && data.length > 0 && data[0].notification_email) {
            setEmailNotifications(data[0].notification_email);
        }
    }

    // 1. Отправка заявки на партнёрство
    const handleVendorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('vendor_requests').insert({
            user_id: userId,
            category: vendorCategory,
            scale: vendorScale,
            description: vendorText
        });

        setLoading(false);
        if (error) {
            setStatusMessage(t('errSend') + ': ' + error.message);
        } else {
            setStatusMessage(t('successVendor'));
            setVendorText('');
            setTimeout(() => setActiveSection('main'), 2000);
        }
    };

    // 2. Отправка жалобы или обращения в техподдержку
    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('support_tickets').insert({
            user_id: userId,
            ticket_type: supportType,
            message: supportText
        });

        setLoading(false);
        if (error) {
            setStatusMessage(t('errSend') + ': ' + error.message);
        } else {
            setStatusMessage(t('successSupport'));
            setSupportText('');
            setTimeout(() => setActiveSection('main'), 2000);
        }
    };

    // 3. Сохранение настроек почты в профиль
    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({ notification_email: emailNotifications })
            .eq('id', userId);

        setLoading(false);
        if (error) {
            setStatusMessage(t('errSave') + ': ' + error.message);
        } else {
            setStatusMessage(t('successSettings'));
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    return (
        <div className="space-y-6">

            {activeSection !== 'main' && (
                <button
                    onClick={() => { setActiveSection('main'); setStatusMessage(''); }}
                    className="inline-flex items-center text-xs font-semibold text-amber-400 hover:text-amber-300 transition gap-1 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10"
                >
                    {t('backToMenu')}
                </button>
            )}

            {/* 1. ГЛАВНОЕ МЕНЮ */}
            {activeSection === 'main' && (
                <div className="space-y-4">
                    <div className="text-center pb-2">
                        <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full mx-auto flex items-center justify-center text-2xl shadow-lg">
                            👤
                        </div>
                        <h2 className="text-lg font-bold text-white mt-2">{t('profileManagement')}</h2>
                        <p className="text-[11px] text-slate-400">{t('profileSubtitle')}</p>
                    </div>

                    <div className="space-y-2.5">
                        <button
                            onClick={() => { setActiveSection('vendor_request'); setStatusMessage(''); }}
                            className="w-full bg-[#0f172a]/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">💼</span>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-200">{t('becomePartner')}</p>
                                    <p className="text-[10px] text-slate-400">{t('becomePartnerDesc')}</p>
                                </div>
                            </div>
                            <span className="text-slate-500 text-xs">→</span>
                        </button>

                        <button
                            onClick={() => { setActiveSection('settings'); setStatusMessage(''); }}
                            className="w-full bg-[#0f172a]/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">⚙️</span>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-200">{t('notificationSettings')}</p>
                                    <p className="text-[10px] text-slate-400">{t('notificationSettingsDesc')}</p>
                                </div>
                            </div>
                            <span className="text-slate-500 text-xs">→</span>
                        </button>

                        <button
                            onClick={() => { setActiveSection('support'); setStatusMessage(''); }}
                            className="w-full bg-[#0f172a]/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🛠️</span>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-200">{t('helpAndComplaints')}</p>
                                    <p className="text-[10px] text-slate-400">{t('helpAndComplaintsDesc')}</p>
                                </div>
                            </div>
                            <span className="text-slate-500 text-xs">→</span>
                        </button>
                    </div>
                </div>
            )}

            {/* 2. ФОРМА: ЗАЯВКА НА ПАРТНЕРСТВО */}
            {activeSection === 'vendor_request' && (
                <form onSubmit={handleVendorSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-amber-400">💼 {t('vendorRequestTitle')}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t('vendorRequestSubtitle')}</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('serviceCategory')}</label>
                            <select
                                value={vendorCategory}
                                onChange={(e) => setVendorCategory(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                            >
                                <option value="match">{t('catMatchmaker')}</option>
                                <option value="psy">{t('catPsychology')}</option>
                                <option value="documents">{t('catLaw')}</option>
                                <option value="celebration">{t('catCelebration')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('serviceScale')}</label>
                            <select
                                value={vendorScale}
                                onChange={(e) => setVendorScale(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                            >
                                <option value="city">{t('scaleCity')}</option>
                                <option value="regional">{t('scaleRegional')}</option>
                                <option value="federal">{t('scaleFederal')}</option>
                                <option value="international">{t('scaleInternational')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('qualificationLabel')}</label>
                            <textarea
                                required
                                value={vendorText}
                                onChange={(e) => setVendorText(e.target.value)}
                                rows={4}
                                placeholder={t('qualificationPlaceholder')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all"
                    >
                        {loading ? t('sending') : t('submitVendorBtn')}
                    </button>
                </form>
            )}

            {/* 3. ФОРМА: НАСТРОЙКИ ПОЧТЫ */}
            {activeSection === 'settings' && (
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-amber-400">⚙️ {t('notificationSettings')}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t('emailSettingsSubtitle')}</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('notificationEmail')}</label>
                            <input
                                type="email"
                                required
                                value={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.value)}
                                placeholder="example@mail.com"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all"
                    >
                        {loading ? t('saving') : t('saveSettingsBtn')}
                    </button>
                </form>
            )}

            {/* 4. ФОРМА: ПОМОЩЬ И ЖАЛОБЫ */}
            {activeSection === 'support' && (
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-amber-400">🛠️ {t('supportService')}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t('supportSubtitle')}</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('requestType')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sup_type" checked={supportType === 'tech'} onChange={() => setSupportType('tech')} className="accent-amber-500" />
                                    <span>{t('typeTech')}</span>
                                </label>
                                <label className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sup_type" checked={supportType === 'report'} onChange={() => setSupportType('report')} className="accent-amber-500" />
                                    <span className="text-rose-400 font-medium">{t('typeReport')}</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">{t('requestDetails')}</label>
                            <textarea
                                required
                                value={supportText}
                                onChange={(e) => setSupportText(e.target.value)}
                                rows={4}
                                placeholder={t('supportPlaceholder')}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all"
                    >
                        {loading ? t('sending') : t('submitSupportBtn')}
                    </button>
                </form>
            )}

            {/* Вывод статуса */}
            {statusMessage && (
                <div className="mt-4 text-center p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-medium">
                    {statusMessage}
                </div>
            )}
        </div>
    );
}