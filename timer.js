// Fester Startpunkt: 26.08.2026 um 12:00:00 Uhr mittags (UTC timestamp)
// Dieser Wert ist für ALLE Besucher exakt gleich.
const FIRST_TARGET = new Date('2026-08-26T12:00:00Z').getTime() + (12 * 60 * 60 * 1000); // 26.08.2026 24:00 Uhr / 00:00 Uhr
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// Fester vorzeitiger Abzug für Folgezyklen (z. B. 18 Minuten)
const PREMATURE_RESET_MS = 18 * 60 * 1000; 

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
    let currentTarget = FIRST_TARGET;

    // 1. Erster Durchlauf (Heute): Läuft sauber bis zur ersten Zielzeit (00:00 Uhr)
    if (now < FIRST_TARGET) {
        updateDisplayDate(new Date(FIRST_TARGET));
        let diffSeconds = Math.floor((FIRST_TARGET - now) / 1000);
        renderTime(diffSeconds);
        return;
    }

    // 2. Ab morgen / nach Ablauf des ersten Timers:
    // Der Timer verkürzt sich um die vorzeitigen Minuten
    const effectiveCycleMs = TWELVE_HOURS_MS - PREMATURE_RESET_MS;
    
    let elapsedSinceFirst = now - FIRST_TARGET;
    let cycleIndex = Math.floor(elapsedSinceFirst / effectiveCycleMs) + 1;

    // Zielzeit für die Anzeige (Verschiebt sich mit jedem vorzeitigen Reset)
    let displayedTarget = FIRST_TARGET + (cycleIndex * TWELVE_HOURS_MS) - ((cycleIndex - 1) * PREMATURE_RESET_MS);
    let actualEnd = FIRST_TARGET + (cycleIndex * effectiveCycleMs);

    updateDisplayDate(new Date(displayedTarget));

    let diffSeconds = Math.floor((actualEnd - now) / 1000);
    if (diffSeconds < 0) diffSeconds = 0;

    renderTime(diffSeconds);
}

function renderTime(diffSeconds) {
    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

updateTimer();
setInterval(updateTimer, 1000);
