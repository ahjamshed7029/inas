import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Импортируем наш клиент Supabase

export default function EditProfile({ userId }: { userId: string }) {
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
            .eq('id', userId)
            .single();

        if (error) {
            setStatusMessage(`❌ Ошибка загрузки профиля: ${error.message}`);
            console.error(error);
            return;
        }
        if (data?.notification_email) {
            setEmailNotifications(data.notification_email);
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
            setStatusMessage('❌ Ошибка отправки: ' + error.message);
        } else {
            setStatusMessage('✓ Заявка успешно отправлена модераторам!');
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
            setStatusMessage('❌ Ошибка отправки: ' + error.message);
        } else {
            setStatusMessage('✓ Обращение принято в обработку!');
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
            setStatusMessage('❌ Ошибка сохранения: ' + error.message);
        } else {
            setStatusMessage('✓ Настройки почты сохранены!');
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
                    ← Назад в меню
                </button>
            )}

            {/* 1. ГЛАВНОЕ МЕНЮ */}
            {activeSection === 'main' && (
                <div className="space-y-4">
                    <div className="text-center pb-2">
                        <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full mx-auto flex items-center justify-center text-2xl shadow-lg">
                            👤
                        </div>
                        <h2 className="text-lg font-bold text-white mt-2">Управление профилем</h2>
                        <p className="text-[11px] text-slate-400">Настройки аккаунта, поддержка и заявки</p>
                    </div>

                    <div className="space-y-2.5">
                        <button
                            onClick={() => { setActiveSection('vendor_request'); setStatusMessage(''); }}
                            className="w-full bg-[#0f172a]/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">💼</span>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-200">Стать партнёром</p>
                                    <p className="text-[10px] text-slate-400">Подать заявку на оказание услуг в магазине</p>
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
                                    <p className="text-xs font-bold text-slate-200">Настройки уведомлений</p>
                                    <p className="text-[10px] text-slate-400">Почта для сообщений и оповещений</p>
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
                                    <p className="text-xs font-bold text-slate-200">Помощь и жалобы</p>
                                    <p className="text-[10px] text-slate-400">Связаться с техподдержкой или сообщить о нарушении</p>
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
                        <h3 className="text-base font-bold text-amber-400">💼 Заявка на оказание услуг</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Станьте верифицированным поставщиком услуг в маркетплейсе Инас.</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Категория услуг</label>
                            <select
                                value={vendorCategory}
                                onChange={(e) => setVendorCategory(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                            >
                                <option value="match">Сваха / Хатыбы</option>
                                <option value="psy">Психология</option>
                                <option value="documents">Никиах / Право</option>
                                <option value="celebration">Торжества</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Масштаб оказываемой услуги</label>
                            <select
                                value={vendorScale}
                                onChange={(e) => setVendorScale(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                            >
                                <option value="Городской">Городской (В пределах одного города)</option>
                                <option value="Региональный">Региональный уровень</option>
                                <option value="Федеральный">Федеральный масштаб</option>
                                <option value="Международный">Международный (Онлайн)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Описание квалификации, адрес и контакты</label>
                            <textarea
                                required
                                value={vendorText}
                                onChange={(e) => setVendorText(e.target.value)}
                                rows={4}
                                placeholder="Укажите стаж работы, рабочий адрес, номер телефона..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all"
                    >
                        {loading ? 'Отправка...' : 'Отправить заявку модераторам'}
                    </button>
                </form>
            )}

            {/* 3. ФОРМА: НАСТРОЙКИ ПОЧТЫ */}
            {activeSection === 'settings' && (
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-amber-400">⚙️ Настройки уведомлений</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Укажите Email для получения мгновенных оповещений.</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Почта для сообщений</label>
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
                        {loading ? 'Сохранение...' : 'Сохранить настройки почты'}
                    </button>
                </form>
            )}

            {/* 4. ФОРМА: ПОМОЩЬ И ЖАЛОБЫ */}
            {activeSection === 'support' && (
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-amber-400">🛠️ Служба поддержки</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Сообщите о технической неисправности или нарушении Адаба.</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Тип обращения</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sup_type" checked={supportType === 'tech'} onChange={() => setSupportType('tech')} className="accent-amber-500" />
                                    <span>Тех. ошибка</span>
                                </label>
                                <label className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sup_type" checked={supportType === 'report'} onChange={() => setSupportType('report')} className="accent-amber-500" />
                                    <span className="text-rose-400 font-medium">Жалоба / Адаб</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Суть обращения</label>
                            <textarea
                                required
                                value={supportText}
                                onChange={(e) => setSupportText(e.target.value)}
                                rows={4}
                                placeholder="Опишите ситуацию подробно..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500 placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all"
                    >
                        {loading ? 'Отправка...' : 'Отправить обращение'}
                    </button>
                </form>
            )}

            {/* Вывод статуса */}
            {statusMessage && (
                <div className="text-center p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-medium">
                    {statusMessage}
                </div>
            )}

        </div>
    );
}