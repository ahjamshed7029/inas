import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ActiveChatListItem {
    id: string; // ID чата
    partner: {
        id: string;
        display_name: string;
        location: string;
    };
}

export default function ChatList({ userId, onSelectChat }: { userId: string, onSelectChat: (chatId: string, partner: any) => void }) {
    const [chats, setChats] = useState<ActiveChatListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchActiveChats();
        }
    }, [userId]);

    async function fetchActiveChats() {
        setLoading(true);
        try {
            // Шаг 1: Берем только плоские данные из matches и вложенные id чатов
            const { data: matchesData, error: matchesError } = await supabase
                .from('matches')
                .select(`
                    id,
                    sender_id,
                    receiver_id,
                    chats ( id )
                `)
                .eq('status', 'accepted')
                .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

            if (matchesError) throw matchesError;

            if (!matchesData || matchesData.length === 0) {
                setChats([]);
                return;
            }

            // Собираем ID всех партнеров, с кем есть мэтч
            const partnerIds = matchesData.map((item: any) =>
                item.sender_id === userId ? item.receiver_id : item.sender_id
            );

            // Шаг 2: Вытягиваем профили этих партнеров одним запросом .in()
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, display_name, location')
                .in('id', partnerIds);

            if (profilesError) throw profilesError;

            // Шаг 3: Сопоставляем мэтчи с данными профилей
            const formattedChats: ActiveChatListItem[] = matchesData
                .map((item: any) => {
                    const partnerId = item.sender_id === userId ? item.receiver_id : item.sender_id;
                    const partnerProfile = profilesData?.find((p: any) => p.id === partnerId);
                    const chatId = item.chats?.[0]?.id || null;

                    if (!partnerProfile || !chatId) return null;

                    return {
                        id: chatId,
                        partner: {
                            id: partnerProfile.id,
                            display_name: partnerProfile.display_name,
                            location: partnerProfile.location
                        }
                    };
                })
                // Исправлено: Добавили type guard, чтобы TS убедился в отсутствии null
                .filter((c): c is ActiveChatListItem => c !== null);

            setChats(formattedChats);
        } catch (error) {
            console.error('Error fetching active chats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="text-center text-slate-400 py-10 text-xs">Загрузка ваших бесед...</div>;
    if (chats.length === 0) return <div className="text-center text-slate-500 py-12 text-xs">У вас пока нет активных диалогов. Загляните во Входящие или Рекомендации.</div>;

    return (
        <div className="w-full max-w-md mx-auto my-4 text-white px-2 space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase px-1">Ваши собеседники ({chats.length})</h3>

            <div className="space-y-2">
                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id, chat.partner)}
                        className="w-full bg-[#0f172a] border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-4 flex justify-between items-center transition shadow-md text-left active:scale-[0.99]"
                    >
                        <div className="space-y-1">
                            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                                💬 {chat.partner.display_name}
                            </h4>
                            <p className="text-[10px] text-slate-500">📍 {chat.partner.location}</p>
                        </div>

                        <div className="w-7 h-7 bg-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
                            ➔
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}