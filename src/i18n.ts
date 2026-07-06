import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    // Кусочек для примера структуры внутри resources в src/i18n.ts:
    uz: {
        translation: {
            // Шапка и Вкладки
            adab_hub_title: "ADAB MARKAZI",
            adab_hub_subtitle: "Islomiy marketpleys-ekotizim",
            tab_services: "🏪 Xizmatlar",
            tab_health: "🍏 Salomatlik",
            tab_creative: "✍️ Ijodkorlik",

            // Услуги (Всё для Никяха)
            sec_wedding: "Nikoh va To'y uchun hammasi",
            cat_rent: "Kiyim ijarasi",
            cat_tailor: "Tikuvchilar va Dizaynerlar",
            cat_rest: "Kafe va Restoranlar",
            cat_tamada: "Boshlovchilar (Tamada)",
            cat_decor: "Dizayn va Interyer",
            cat_svaha: "Sovchilik xizmatlari",

            // Услуги (Бытовые)
            sec_lifestyle: "Maishiy va Layfstayl",
            cat_beauty: "Sartoshxonalar va Salonlar",
            cat_cars: "Avtomobil ijarasi",
            cat_hotels: "Mehmonxonalar va Xostellar",
            cat_photo: "Halol fotograflar",

            // Карточки вендоров
            offers_count: "{{count}} ta taklif",
            btn_back: "← Orqaga",
            btn_book: "Yozish / Band qilish",
            price_from: "dan",
            price_day: "kun",
            price_pers: "kishi",

            // ИИ Помощник
            ai_title: "Adab AI Yordamchisi",
            ai_profile_label: "1. Profilni tanlang:",
            ai_dir_label: "2. Bilim yo'nalishi:",
            ai_btn_generate: "🎯 Foydali kontentni yig'ish",
            ai_loading: "Tahlil qilinmoqda...",
            ai_sec_sunna: "✨ Sunnat bo'yicha:",
            ai_sec_med: "⚕️ Fan va Tibbiyot:",
            ai_sec_advice: "💡 Muhim maslahat:",

            // Творчество
            creative_title: "Halol ijodkorlik",
            btn_editor_open: "✍️ Nashr qilish",
            btn_editor_close: "Tahrirlovchini yopish",
            creative_warn: "Eslatma: Faqat Adab va Shariat me'yorlariga mos keladigan she'rlar, hikoyalar va mulohazalarni nashr eting. Faqat matnli kontentga ruxsat beriladi.",
            input_placeholder: "Hayotingizdan olingan ibratli hikoya yoki she'ringizni ulashing...",
            btn_publish: "Minbarda nashr qilish",
            post_moderated: "Moderatsiyadan o'tgan",
            time_2h: "2 soat oldin",
            time_yesterday: "Kecha",
            time_now: "Hozirgincha",

            // Qo'shimcha kalitlar
            search: "Qidiruv",
            adab: "Odob",
            chats: "Chatlar",
            menu: "Menyu",
            logout: "Chiqish",
            adab_title: "ODOB MARKAZI"
        }
    },
    ru: {
        translation: {
            adab_hub_title: "Центр Адаб",
            adab_hub_subtitle: "Исламская маркетплейс-экосистема",
            tab_services: "🏪 Услуги",
            tab_health: "🍏 Здоровье",
            tab_creative: "✍️ Творчество",
            sec_wedding: "Всё для Никяха и Свадьбы",
            cat_rent: "Прокат одежды",
            cat_tailor: "Швеи и Дизайнеры",
            cat_rest: "Кафе и Рестораны",
            cat_tamada: "Ведущие (Тамада)",
            cat_decor: "Дизайн & Интерьер",
            cat_svaha: "Услуги Свах",
            sec_lifestyle: "Бытовые и Лайфстайл",
            cat_beauty: "Парикмахеры & Салоны",
            cat_cars: "Прокат машин",
            cat_hotels: "Гостиницы & Хостелы",
            cat_photo: "Халяль-Фотографы",
            offers_count: "{{count}} предложений",
            btn_back: "← Назад",
            btn_book: "Написать / Забронировать",
            price_from: "от",
            price_day: "день",
            price_pers: "чел",
            ai_title: "ИИ-Помощник Адаба",
            ai_profile_label: "1. Выберите профиль:",
            ai_dir_label: "2. Направление знаний:",
            ai_btn_generate: "🎯 Собрать полезный контент",
            ai_loading: "Анализ...",
            ai_sec_sunna: "✨ По Сунне:",
            ai_sec_med: "⚕️ Наука & Медицина:",
            ai_sec_advice: "💡 Важный совет:",
            creative_title: "Дозволенное творчество",
            btn_editor_open: "✍️ Опубликовать",
            btn_editor_close: "Закрыть редактор",
            creative_warn: "Напоминание: Публикуйте только стихи, рассказы и размышления, соответствующие нормам Адаба и Шариата. Разрешен только чистый текст.",
            input_placeholder: "Поделитесь вашим стихотворением или поучительной историей из жизни...",
            btn_publish: "Опубликовать на трибуне",
            post_moderated: "Модерировано",
            time_2h: "2 часа назад",
            time_yesterday: "Вчера",
            time_now: "Только что",

            // Дополнительные ключи
            search: "Поиск",
            adab: "Адаб",
            chats: "Чаты",
            menu: "Меню",
            logout: "Выйти",
            adab_title: "ЦЕНТР АДАБ"
        }
    },
    kk: {
        translation: { search: "Іздеу", adab: "Әдеп", chats: "Әңгімелер", menu: "Мәзір", logout: "Шығу", adab_title: "ӘДЕП ОРТАЛЫҒЫ" }
    },
    tg: {
        translation: { search: "Ҷустуҷӯ", adab: "Адаб", chats: "Сӯҳбатҳо", menu: "Меню", logout: "Баромад", adab_title: "МАРКАЗИ АДАБ" }
    },
    ky: {
        translation: { search: "Издөө", adab: "Адеп", chats: "Маектер", menu: "Меню", logout: "Чыгуу", adab_title: "АДЕП БОРБОРУ" }
    },
    tk: {
        translation: { search: "Gözleg", adab: "Adap", chats: "Gürrüňdeşlikler", menu: "Menýu", logout: "Chykmak", adab_title: "ADAP MERKEZI" }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'uz',
        interpolation: { escapeValue: false }
    });

export default i18n;