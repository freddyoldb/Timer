let baseTargetTime = null;
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// Zufälliger vorzeitiger Reset-Abstand (10 bis 30 Min in s)
let resetOffset = Math.floor(Math.random() * (1800 - 600 + 1)) + 600; 

async function fetchServerTime() {
    try {
        const response = await fetch('timestamp.json?t=' + new Date().getTime());
        const data = await response.json();
        baseTargetTime = data.targetTime;
    } catch (error) {
        if (!baseTargetTime) {
            baseTargetTime = Date.now() + TWELVE_HOURS_MS;
        }
    }
}

function updateDisplayDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    document.getElementById('target-date').innerText = `${day}.${month}.${year} um ${hours}:${minutes} Uhr`;
}

function updateTimer() {
    if (!baseTargetTime) return;

    const now = Date.now();

    // Ermitteln des aktuellen Zyklus basierend auf dem geheimen Reset-Offset
    let currentTarget = baseTargetTime;
    while (now >= currentTarget - (resetOffset * 1000)) {
        currentTarget += TWELVE_HOURS_MS;
    }

    // 1. Die angezeigte Zielzeit zeigt STETS das vollwertige 12-Stunden-Ziel an (ohne Abzug)
    updateDisplayDate(new Date(currentTarget));

    // 2. Verbleibende Sekunden bis zum echten Ablauf berechnen
    let diffSeconds = Math.floor((currentTarget - now) / 1000);

    // Formatierung HH:MM:SS
    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

fetchServerTime();
setInterval(fetchServerTime, 60000);
setInterval(updateTimer, 1000);
