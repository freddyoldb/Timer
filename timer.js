// Ziel für HEUTE Nacht: Exakt 27.08.2026 um 00:00:00 Uhr (deutsche Zeit)
const TODAY_MIDNIGHT = new Date(2026, 7, 27, 0, 0, 0, 0).getTime();
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const RESET_OFFSET = 18 * 60 * 1000; // 18 Minuten vorzeitiger Abzug für Folgetage

function updateDisplay(targetTimeMs) {
    const date = new Date(targetTimeMs);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    document.getElementById('target-date').innerText = `${day}.${month}.${year} um ${hours}:${minutes} Uhr`;
}

function updateTimer() {
    const now = Date.now();

    // 1. HEUTE: Zählt strikt auf 00:00:00 Uhr herunter
    if (now < TODAY_MIDNIGHT) {
        updateDisplay(TODAY_MIDNIGHT);
        let diff = Math.floor((TODAY_MIDNIGHT - now) / 1000);
        render(diff);
        return;
    }

    // 2. AB MORGEN (nach 00:00 Uhr): Rechnet dynamisch mit vorzeitigem Abzug
    const cycleTime = TWELVE_HOURS - RESET_OFFSET;
    const passedCycles = Math.floor((now - TODAY_MIDNIGHT) / cycleTime) + 1;

    const actualEnd = TODAY_MIDNIGHT + (passedCycles * cycleTime);
    const currentTarget = TODAY_MIDNIGHT + (passedCycles * TWELVE_HOURS) - ((passedCycles - 1) * RESET_OFFSET);

    updateDisplay(currentTarget);
    let diff = Math.floor((actualEnd - now) / 1000);
    if (diff < 0) diff = 0;

    render(diff);
}

function render(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

updateTimer();
setInterval(updateTimer, 1000);
