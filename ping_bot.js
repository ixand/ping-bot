import 'dotenv/config';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const railwayURL = process.env.RAILWAY_URL;

let previousStatus = null; // null | true (alive) | false (down)

async function checkService(name, url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log(`[✅] ${name} активний (статус: ${response.status})`);
            return true;
        } else {
            console.log(`[⚠️] ${name} відповідає, але статус: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`[❌] ${name} недоступний. Помилка: ${error.message}`);
        return false;
    }
}

async function notifyTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message })
        });
        console.log(`[📩] Повідомлення надіслано в Telegram`);
    } catch (error) {
        console.error(`[❌] Помилка надсилання в Telegram: ${error.message}`);
    }
}

async function main() {
    console.log(`\n🔍 [${new Date().toLocaleTimeString()}] Перевірка Railway...\n`);

    const isAlive = await checkService('Бот на Railway', railwayURL);

    // Якщо статус змінився або це перший запуск — надіслати повідомлення
    if (previousStatus === null || isAlive !== previousStatus) {
        const msg = isAlive
            ? `✅ Railway (production) активний і відповідає.`
            : `❌ Бот на Railway недоступний! Можливо, тривають технічні роботи.`;

        console.log('\n[ℹ️] ' + msg);
        await notifyTelegram(msg);
    }

    previousStatus = isAlive;
}

main();
setInterval(main, 3 * 1000);
