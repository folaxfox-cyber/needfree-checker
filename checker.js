const fs = require('fs');

// Конфигурация уведомлений из секретов GitHub
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TARGET_URL = 'https://github.io';

async function sendTelegramMessage(text) {
    const url = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: 'Markdown' })
        });
        const result = await response.json();
        if (!result.ok) {
            console.error(`❌ Ошибка Telegram API: ${result.description}`);
        } else {
            console.log("✅ Уведомление успешно отправлено в Telegram!");
        }
    } catch (e) {
        console.error("❌ Сетевая ошибка при отправке в Telegram:", e);
    }
}


async function run() {
    try {
        const response = await fetch(TARGET_URL);
        const html = await response.text();
        
        // Извлекаем количество игр регулярным выражением
        const match = html.match(/Total Count:\s*(\d+)/i);
        const currentCount = match ? parseInt(match[1]) : null;

        if (currentCount === null) {
            console.log("Не удалось спарсить количество игр. Возможно, сайт временно недоступен.");
            return;
        }

        console.log(`Текущее количество игр на сайте: ${currentCount}`);

        const logFile = 'last_count.txt';
        let previousCount = null;

        if (fs.existsSync(logFile)) {
            previousCount = parseInt(fs.readFileSync(logFile, 'utf8').trim());
        }

        // Если количество изменилось, отправляем уведомление в Telegram
        if (previousCount !== null && currentCount !== previousCount) {
            const message = `🚨 *Обновление на NeedFree!*\nКоличество бесплатных игр изменилось!\nБыло: ${previousCount} ➔ Стало: ${currentCount}\nСсылка: ${TARGET_URL}`;
            await sendTelegramMessage(message);
            console.log("Уведомление отправлено в Telegram!");
        }

        // Сохраняем новое значение для следующей проверки
        fs.writeFileSync(logFile, currentCount.toString(), 'utf8');

    } catch (error) {
        console.error("Ошибка при выполнении скрипта:", error);
    }
}

run();
