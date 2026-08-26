/**
 * Timer Application - Standalone Client-Side Implementation
 * 
 * Dies ist eine vollständig Client-seitige Timer-Anwendung.
 * Alle Funktionalität läuft im Browser, NICHT auf einem Server.
 */

class TimerApplication {
    constructor() {
        this.isRunning = false;
        this.elapsedSeconds = 0;
        this.intervalId = null;
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.sessionTime = document.getElementById('sessionTime');
        this.copyTelegramBtn = document.getElementById('copyTelegramBtn');
        this.requestStatus = document.getElementById('requestStatus');
        this.notificationArea = document.getElementById('notificationArea');
        
        this.sessionStartTime = Date.now();
        this.timerExtensions = 0;
        
        this.initializeEventListeners();
        this.updateSessionTime();
        
        console.log('✓ Timer Application initialized');
    }

    initializeEventListeners() {
        // Timer-Steuerung
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.logoutBtn.addEventListener('click', () => this.logout());
        
        // Telegram Button
        this.copyTelegramBtn.addEventListener('click', () => this.handleTelegramExtension());
        
        // Update Session-Zeit alle 1 Sekunde
        setInterval(() => this.updateSessionTime(), 1000);
    }

    /**
     * Startet den Timer
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.resetBtn.disabled = true;

        this.intervalId = setInterval(() => {
            this.elapsedSeconds++;
            this.updateDisplay();
        }, 1000);
        
        console.log('▶️ Timer started');
    }

    /**
     * Pausiert den Timer
     */
    pause() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = false;

        clearInterval(this.intervalId);
        console.log('⏸️ Timer paused');
    }

    /**
     * Setzt den Timer zurück
     */
    reset() {
        this.isRunning = false;
        this.elapsedSeconds = 0;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = false;

        clearInterval(this.intervalId);
        this.updateDisplay();
        console.log('🔄 Timer reset');
    }

    /**
     * Aktualisiert die Zeitanzeige
     */
    updateDisplay() {
        const hours = Math.floor(this.elapsedSeconds / 3600);
        const minutes = Math.floor((this.elapsedSeconds % 3600) / 60);
        const seconds = this.elapsedSeconds % 60;

        this.timeDisplay.textContent = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }

    /**
     * Update Session-Zeit
     */
    updateSessionTime() {
        const elapsed = Math.round((Date.now() - this.sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.sessionTime.textContent = `Verbunden seit ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Handle Telegram Extension Button Click
     * TODO: Würde einen echten Telegram Bot API-Call machen
     */
    async handleTelegramExtension() {
        const telegramHandle = '@TimerExtensionBot';
        
        // Kopiere Bot-Handle in Zwischenablage
        navigator.clipboard.writeText(telegramHandle).then(() => {
            this.showNotification(`📋 Bot-Handle "${telegramHandle}" kopiert!`, 'success');
        }).catch(err => {
            this.showNotification('❌ Fehler beim Kopieren', 'error');
        });
        
        // Zeige Request-Status
        this.requestStatus.classList.remove('hidden');
        
        // Simuliere Verarbeitung (300ms + 2.7s = ~3 Sekunden)
        const delay = new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
            await delay;
            
            this.timerExtensions++;
            this.requestStatus.classList.add('hidden');
            
            this.showNotification(
                `✓ Verlängerung verarbeitet (#${this.timerExtensions})`,
                'success'
            );
            
            // Log zur Konsole
            console.log(`⏱️ Timer extension #${this.timerExtensions} processed`);
            console.log('Note: Dies ist eine CLIENT-SEITIGE Simulation. Ein echter Bot würde vom Server aufgerufen.');
            
        } catch (error) {
            this.requestStatus.classList.add('hidden');
            this.showNotification('❌ Verlängerung fehlgeschlagen', 'error');
        }
    }

    /**
     * Zeige Benachrichtigung
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        this.notificationArea.appendChild(notification);
        
        // Auto-remove nach 4 Sekunden
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    /**
     * Logout
     */
    logout() {
        if (confirm('Möchten Sie sich wirklich abmelden?')) {
            // Stoppe Timer
            this.reset();
            
            // Log Session Info
            const sessionDuration = Math.round((Date.now() - this.sessionStartTime) / 1000);
            console.log('🔓 Session ended');
            console.log(`Duration: ${sessionDuration} seconds`);
            console.log(`Total extensions: ${this.timerExtensions}`);
            
            // Zeige Info
            this.showNotification('Sie haben sich abgemeldet', 'info');
            
            // Optional: Seite neu laden
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}

// Initialisiere die Timer-Anwendung, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new TimerApplication();
    
    // Zeige Warnung in Konsole
    console.log('%c⚠️ WICHTIG', 'color: orange; font-size: 16px; font-weight: bold;');
    console.log('%cDies ist eine CLIENT-SEITIGE Timer-Anwendung.', 'color: orange;');
    console.log('%cFür produktiven Einsatz wird ein echtes Backend benötigt:', 'color: orange;');
    console.log('%c  - Authentifizierung auf dem Server', 'color: gray;');
    console.log('%c  - Echte Telegram Bot Integration', 'color: gray;');
    console.log('%c  - E-Mail Versand vom Server', 'color: gray;');
    console.log('%c  - Sichere Session-Verwaltung', 'color: gray;');
});
