let targetTimestamp = null;
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// Generiert zufällige Sekunden zwischen 10 Min (600s) und 30 Min (1800s)
function getRandomOffset() {
    return Math.floor(Math.random() * (1800 - 600 + 1)) + 600;
}

let currentResetOffset = getRandomOffset();

async function fetchServerTime() {
    try {
        const response = await fetch('timestamp.json?t=' + new Date().getTime());
        const data = await response.json();
        
        // Falls noch keine Zielzeit lokal existiert, nimm die aus der timestamp.json
        if (!targetTimestamp) {
            targetTimestamp = data.targetTime;
        }
    } catch (error) {
        if (!targetTimestamp) {
            targetTimestamp = Date.now() + TWELVE_HOURS_MS;
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
    if (!targetTimestamp) return;

    const now = Date.now();
    let diffSeconds = Math.floor((targetTimestamp - now) / 1000);

    // Sobald die Restzeit das zufällige Fenster (10-30 Min vor Ende) erreicht:
    if (diffSeconds <= currentResetOffset) {
        // 1. Neuer Zielzeitpunkt = JETZT + 12 Stunden (Verschiebt die Zieluhrzeit dynamisch!)
        targetTimestamp = now + TWELVE_HOURS_MS;
        
        // 2. Neuer zufälliger Offset für den nächsten Durchlauf
        currentResetOffset = getRandomOffset();
        
        // 3. Restzeit neu berechnen
        diffSeconds = Math.floor((targetTimestamp - now) / 1000);
    }

    // Zeige das dynamisch verschobene Ziel-Datum an
    updateDisplayDate(new Date(targetTimestamp));

    // Zeit-Formatierung (HH:MM:SS)
    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

fetchServerTime();
setInterval(fetchServerTime, 60000);
setInterval(updateTimer, 1000);
