let targetTime;

function calculateNextTarget() {
    const now = new Date();
    const currentHours = now.getHours();
    
    targetTime = new Date(now);
    
    // Nächste Zieluhrzeit ermitteln (12:00 Uhr mittags oder 00:00 Uhr mitternachts)
    if (currentHours < 12) {
        targetTime.setHours(12, 0, 0, 0);
    } else {
        targetTime.setHours(24, 0, 0, 0); // Entspricht 00:00 Uhr des nächsten Tages
    }
    
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

    // Wenn die Zielzeit erreicht ist, berechne das nächste 12h-Intervall
    if (diffSeconds <= 0) {
        calculateNextTarget();
        return;
    }

    const hrs = String(Math.floor(diffSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diffSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(diffSeconds % 60).padStart(2, '0');

    document.getElementById('timer').innerText = `${hrs}:${mins}:${secs}`;
}

calculateNextTarget();
setInterval(updateTimer, 1000);
