import { useState } from 'react';

interface Service {
    id: string;
    title: string;
    category: 'psy' | 'match' | 'documents' | 'celebration';
    price: string;
    scale: string; // Масштаб оказания услуг
    address: string;
    phone: string;
    description: string;
    features: string[];
}

export default function ServiceMarket() {
    const [activeCategory, setActiveCategory] = useState<'all' | 'psy' | 'match' | 'documents' | 'celebration'>('all');
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const categories = [
        { id: 'all', label: '📊 Все' },
        { id: 'match', label: '🤝 Свахи / Хатыбы' },
        { id: 'psy', label: '🧠 Психология' },
        { id: 'documents', label: '📜 Никиах / Право' },
        { id: 'celebration', label: '🎉 Торжества' },
    ];

    const services: Service[] = [
        {
            id: '1',
            title: 'Индивидуальный подбор пары хатыбом',
            category: 'match',
            price: '5 000 руб.',
            scale: 'Региональный (Татарстан / Поволжье)',
            address: 'г. Казань, ул. Габдуллы Тукая, д. 38, офис 4',
            phone: '+7 (999) 123-45-67',
            description: 'Ручной конфиденциальный подбор кандидатов через закрытую верифицированную базу. Сваха лично проводит беседу с каждой стороной и проверяет намерения.',
            features: ['Проверка анкет на соответствие Шариату', 'Сопровождение первого знакомства (Махрам)', '3 гарантированных кандидата']
        },
        {
            id: '2',
            title: 'Доврачебная семейная консультация',
            category: 'psy',
            price: '3 500 руб. / сессия',
            scale: 'Международный (Онлайн по всему миру / Офлайн в Москве)',
            address: 'г. Москва, Проспект Мира, д. 102, стр. 2',
            phone: '+7 (903) 777-88-99',
            description: 'Сертифицированный мусульманский психолог поможет подготовиться к браку, разобрать психологическую готовность и ожидания от семейной жизни.',
            features: ['Тестирование на психологическую совместимость', 'Проработка страхов перед никах', 'Формат: Онлайн (Zoom/Telegram) или Очно']
        },
        {
            id: '3',
            title: 'Юридическое оформление брачного договора (Махр)',
            category: 'documents',
            price: '8 000 руб.',
            scale: 'Федеральный (Вся РФ)',
            address: 'г. Уфа, ул. Мустая Карима, д. 15',
            phone: '+7 (347) 222-33-44',
            description: 'Составление брачного контракта с учетом норм исламского права (фикх) и законодательства РФ. Фиксация условий махра и обязательств сторон.',
            features: ['Полная юридическая сила', 'Учет условий выплаты Махра', 'Консультация шариатского эксперта']
        },
        {
            id: '4',
            title: 'Организация Халяль-Торжеств (Никах под ключ)',
            category: 'celebration',
            price: 'от 50 000 руб.',
            scale: 'Городской (Казань и пригород)',
            address: 'г. Казань, ул. Кремлевская, д. 12',
            phone: '+7 (843) 555-66-77',
            description: 'Полный комплекс услуг по проведению благословенного праздника: подбор мечети, халяль-кейтеринг, оформление зала и ведущий, соблюдающий нормы ислама.',
            features: ['Раздельные зоны по желанию', 'Халяль меню (сертификация)', 'Подбор фотографа-сестры для женщин']
        }
    ];

    const filteredServices = activeCategory === 'all'
        ? services
        : services.filter(s => s.category === activeCategory);

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <div className="text-center">
                <h2 className="text-xl font-bold text-amber-400">💎 Магазин полезных услуг</h2>
                <p className="text-[11px] text-slate-400 mt-1">Официальные сервисы, специалисты и халяль-услуги для вашей будущей семьи</p>
            </div>

            {/* Горизонтальный скролл категорий */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as any)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${activeCategory === cat.id
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Список услуг / карточки */}
            <div className="space-y-4">
                {filteredServices.map(service => (
                    <div
                        key={service.id}
                        className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md hover:border-slate-700/60 transition-all"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-bold text-white leading-snug">{service.title}</h3>
                            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20 whitespace-nowrap">
                                {service.price}
                            </span>
                        </div>

                        {/* Масштаб оказания услуг */}
                        <div className="text-[11px] flex items-center gap-1.5 text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-xl border border-emerald-500/10 w-fit">
                            <span>🌐</span>
                            <span><strong>Масштаб:</strong> {service.scale}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {service.description}
                        </p>

                        {/* Быстрые контакты */}
                        <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40">
                            <div className="flex items-center gap-1.5">
                                <span>📍</span> <span className="truncate"><strong>Адрес:</strong> {service.address}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>📞</span> <span><strong>Тел:</strong> <a href={`tel:${service.phone}`} className="text-amber-400 hover:underline">{service.phone}</a></span>
                            </div>
                        </div>

                        {/* Кнопка подробнее */}
                        <button
                            onClick={() => setSelectedService(service)}
                            className="w-full bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs py-2 rounded-xl border border-slate-700/50 transition-all font-medium"
                        >
                            Подробнее об услуге
                        </button>
                    </div>
                ))}
            </div>

            {/* Модальное окно (Детальная информация) */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-start">
                            <h3 className="text-base font-bold text-white">{selectedService.title}</h3>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-slate-400 hover:text-white text-lg font-bold bg-slate-800 w-7 h-7 rounded-full flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>

                        <div className="text-sm font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 w-fit">
                            Стоимость: {selectedService.price}
                        </div>

                        <div className="space-y-1 text-xs text-slate-300">
                            <p className="font-semibold text-slate-400">Описание:</p>
                            <p className="leading-relaxed">{selectedService.description}</p>
                        </div>

                        {/* Преимущества списком */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-slate-400">Что входит в стоимость:</p>
                            <ul className="space-y-1">
                                {selectedService.features.map((f, i) => (
                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                        <span className="text-amber-400">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Полные контакты */}
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-2 text-xs text-slate-300">
                            <p className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">Контакты организации</p>
                            <p>🌐 <strong>Масштаб:</strong> {selectedService.scale}</p>
                            <p>📍 <strong>Адрес:</strong> {selectedService.address}</p>
                            <p>📞 <strong>Телефон:</strong> <a href={`tel:${selectedService.phone}`} className="text-amber-400 font-bold hover:underline">{selectedService.phone}</a></p>
                        </div>

                        <a
                            href={`tel:${selectedService.phone}`}
                            className="block text-center w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all text-xs"
                        >
                            Позвонить и заказать
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}