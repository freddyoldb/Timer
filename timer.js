let targetTime;
let resetThreshold;

function initTimer() {
    const now = new Date();
    // Setzt die Zielzeit auf genau 12 Stunden in der Zukunft
    targetTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    
    // Zufälliger Reset-Zeitpunkt zwischen 10 Minuten (600s) und 30 Minuten (1800s) vor Ablauf
    resetThreshold = Math.floor(Math.random() * (1800 - 600 + 1)) + 600;
    
    updateDisplayDate(targetTime);
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
    const now = new Date();
    let diffSeconds = Math.floor((targetTime - now) / 1000);

    // Wenn das zufällige Zeitfenster erreicht ist, startet der Timer neu
    if (diffSeconds <= resetThreshold) {
        initTimer();
        return;
    }

    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

initTimer();
setInterval(updateTimer, 1000);
