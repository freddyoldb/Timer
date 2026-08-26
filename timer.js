let baseTargetTime = null;
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// Zufälliger Reset-Abstand (10 bis 30 Min vor Ablauf)
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

    // 1. Richtigen 12h-Block berechnen
    let cleanTarget = baseTargetTime;
    while (now >= cleanTarget) {
        cleanTarget += TWELVE_HOURS_MS;
    }

    // Echte Zielzeit für die Anzeige setzen (ohne Abzüge)
    updateDisplayDate(new Date(cleanTarget));

    // 2. Tatsächlicher Reset-Zeitpunkt (10-30 Min früher)
    const effectiveTarget = cleanTarget - (resetOffset * 1000);

    // Sobald die Schwelle erreicht ist, springt die Logik zum nächsten 12h-Block
    if (now >= effectiveTarget) {
        cleanTarget += TWELVE_HOURS_MS;
        updateDisplayDate(new Date(cleanTarget));
        // Neuen zufälligen Offset für den nächsten Durchlauf generieren
        resetOffset = Math.floor(Math.random() * (1800 - 600 + 1)) + 600;
    }

    // Restzeit bis zum (vorzeitigen) Reset berechnen
    let diffSeconds = Math.floor(((cleanTarget - (resetOffset * 1000)) - now) / 1000);
    if (diffSeconds < 0) diffSeconds = 0;

    // Formatiere verbleibende Zeit (HH:MM:SS)
    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

fetchServerTime();
setInterval(fetchServerTime, 60000);
setInterval(updateTimer, 1000);
