const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

function getRandomResetOffset() {
    // Zufällige Sekunden zwischen 10 Minuten (600s) und 30 Minuten (1800s)
    return Math.floor(Math.random() * (1800 - 600 + 1)) + 600;
}

function initOrGetTimerData() {
    const savedTarget = localStorage.getItem('deadman_target_time');
    const savedOffset = localStorage.getItem('deadman_reset_offset');
    const now = Date.now();

    // Wenn keine Daten vorhanden sind oder der Timer bereits abgelaufen ist, neu initialisieren
    if (!savedTarget || !savedOffset || parseInt(savedTarget, 10) <= now) {
        return createNewCycle(now);
    }

    return {
        targetTime: parseInt(savedTarget, 10),
        resetOffset: parseInt(savedOffset, 10)
    };
}

function createNewCycle(startTime) {
    const targetTime = startTime + TWELVE_HOURS_MS;
    const resetOffset = getRandomResetOffset();

    localStorage.setItem('deadman_target_time', targetTime);
    localStorage.setItem('deadman_reset_offset', resetOffset);

    return { targetTime, resetOffset };
}

let { targetTime, resetOffset } = initOrGetTimerData();

function updateDisplayDate(targetTimestamp) {
    const date = new Date(targetTimestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    document.getElementById('target-date').innerText = `${day}.${month}.${year} um ${hours}:${minutes} Uhr`;
}

function updateTimer() {
    const now = Date.now();
    let diffSeconds = Math.floor((targetTime - now) / 1000);

    // Sobald die zufällige Schwelle (10-30 Min vor Ende) erreicht ist, Reset auslösen
    if (diffSeconds <= resetOffset) {
        const newCycle = createNewCycle(now);
        targetTime = newCycle.targetTime;
        resetOffset = newCycle.resetOffset;
        diffSeconds = Math.floor((targetTime - now) / 1000);
    }

    updateDisplayDate(targetTime);

    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

updateTimer();
setInterval(updateTimer, 1000);
