const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function testBot() {
    console.log("--- СТАРТ ТЕСТА СВЯЗИ С БОТОМ ---");
    console.log(`Используемый ID чата: ${7176155067}`);
    // Показываем только часть токена в целях безопасности
    console.log(`Используемый Токен (начало): ${8714352542:AAFiFba6tbQhr9NRlEIi-kJ8T4-647hpfrg ? 8714352542:AAFiFba6tbQhr9NRlEIi-kJ8T4-647hpfrg.substring(0, 9) + '...' : 'НЕ НАЙДЕН'}`);

    const url = `https://telegram.org{8714352542:AAFiFba6tbQhr9NRlEIi-kJ8T4-647hpfrg}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chat_id: 7176155067, 
                text: "🚀 Привет! Если ты видишь это сообщение, значит связь между GitHub и ботом настроена идеально!" 
            })
        });

        const result = await response.json();

        if (result.ok) {
            console.log("✅ УСПЕХ! Бот успешно отправил сообщение в Telegram.");
        } else {
            console.log("❌ ОШИБКА ОТ ТЕЛЕГРАМА:");
            console.log(`Код ошибки: ${result.error_code}`);
            console.log(`Описание: ${result.description}`);
            
            if (result.description.includes("bot was blocked")) {
                console.log("👉 РЕШЕНИЕ: Вы забыли зайти в своего бота в Telegram и нажать кнопку СТАРТ.");
            } else if (result.description.includes("chat not found")) {
                console.log("👉 РЕШЕНИЕ: Неверно указан TELEGRAM_CHAT_ID. Перепроверьте его в @userinfobot. Там должны быть только цифры.");
            } else if (result.description.includes("Not Found")) {
                console.log("👉 РЕШЕНИЕ: Неверно указан TELEGRAM_TOKEN в Секретах. Вы скопировали его с ошибкой.");
            }
        }
    } catch (e) {
        console.log("❌ ОШИБКА СЕТИ:", e.message);
    }
}

testBot();
