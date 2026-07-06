export function applyAdabFilter(text: string): string {
    let cleaned = text;

    // 1. Блокировка номеров телефонов и банковских карт (цифровые цепочки от 4 до 16 цифр)
    // Захватывает форматы: +99890..., 8-916..., 4400 1234..., а также разделенные пробелами/тире цифры
    const phoneAndCardRegex = /(?:\+?\d[\s-]?){4,16}/g;
    cleaned = cleaned.replace(phoneAndCardRegex, (match) => {
        // Если это просто короткое слово или год (например, 2026), не трогаем
        const digitsOnly = match.replace(/\D/g, '');
        return digitsOnly.length >= 7 ? ' [контакты скрыты Адабом] ' : match;
    });

    // 2. Блокировка мессенджеров и соцсетей (tg, t.me, inst, @username, vk, whatsapp)
    const socialRegex = /(?:@[\w_]+|t\.me\/[\w_]+|телеграм|инста|тг|inst|telegram|wa\.me|\+7|\+998)/gi;
    cleaned = cleaned.replace(socialRegex, ' [ссылки запрещены] ');

    // 3. Блокировка автомобильных номеров (шаблоны типа 01 A 777 AA, А123ВВ и т.д.)
    const carPlateRegex = /\d{2,3}\s?[A-Z]{1,3}\s?\d{3}\s?[A-Z]{0,2}|\b[A-Z]\d{3}[A-Z]{2}\b/gi;
    cleaned = cleaned.replace(carPlateRegex, ' [номер авто скрыт] ');

    // 4. Попытки написать кодовые слова для обхода (например, "мой номер", "напиши в телегу")
    const bypassKeywords = /(?:номер телефона|мой тг|скинь карту|номер карты|напиши мне в|переходи в)/gi;
    cleaned = cleaned.replace(bypassKeywords, ' [запрос заблокирован] ');

    return cleaned;
}