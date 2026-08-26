// Feste Basis-Startzeit: 26.08.2026 um 22:00:00 Uhr (als Timestamp)
const BASE_START_TIME = 1787695200000; 
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// Deterministischer vorzeitiger Abzug pro Intervall (z. B. 18 Minuten = 1080 Sekunden)
const RESET_OFFSET_SEC = 1080; 

function updateDisplayDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    document.getElementById('target-date').innerText = `${day}.${month}.${year} um ${hours}:${minutes} Uhr`;
}

function updateTimer() {
    const now = Date.now();

    // 1. Zähle ab BASE_START_TIME in Intervallen weiter, die sich um RESET_OFFSET verkürzen
    let currentStart = BASE_START_TIME;
    let cycleLength = TWELVE_HOURS_MS - (RESET_OFFSET_SEC * 1000);

    // Berechne, welcher Zyklus gerade aktiv ist
    while (now >= currentStart + cycleLength) {
        currentStart += cycleLength;
    }

    // Angezeigte Zielzeit für den User (immer exakt Start + 12 Stunden)
    const displayedTarget = currentStart + TWELVE_HOURS_MS;
    updateDisplayDate(new Date(displayedTarget));

    // Die echte Verbleibende Zeit bis zum vorzeitigen Reset
    const actualEnd = currentStart + cycleLength;
    let diffSeconds = Math.floor((actualEnd - now) / 1000);
    if (diffSeconds < 0) diffSeconds = 0;

    // Zeit-Formatierung (HH:MM:SS)
    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

updateTimer();
setInterval(updateTimer, 1000);
