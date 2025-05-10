const fetch = require('node-fetch');

// URL-адреси для перевірки
const railwayURL = 'the-swine-cycle-of-pigs-production.up.railway.app'; і
const localURL = 'http://localhost:8080'; 

async function checkService(name, url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log(`[✅] ${name} активний (статус: ${response.status})`);
        } else {
            console.log(`[⚠️] ${name} відповідає, але неочікуваний статус: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.log(`[❌] ${name} недоступний. Помилка: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('🔍 Перевірка стану ботів...\n');

    const isRailwayAlive = await checkService('Бот на Railway', railwayURL);
    const isLocalAlive = await checkService('Локальний бот', localURL);

    if (!isRailwayAlive) {
        console.log('\n[ℹ️] Схоже, бот на Railway недоступний. Можливо, ведуться технічні роботи...');
    }
}

main();
setInterval(main, 60 * 1000);