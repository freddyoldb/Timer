/**
 * Timer-Anwendung
 * Läuft nur nach erfolgreicher Authentifizierung hinter der Firewall
 */

class TimerApplication {
    constructor() {
        this.isRunning = false;
        this.elapsedSeconds = 0;
        this.intervalId = null;
        this.authForm = document.getElementById('authForm');
        this.statusMessage = document.getElementById('statusMessage');
        this.timerApp = document.getElementById('timerApp');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.userIdentity = document.getElementById('userIdentity');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Authentifizierung
        this.authForm.addEventListener('submit', (e) => this.handleAuthentication(e));

        // Timer-Steuerung
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.logoutBtn.addEventListener('click', () => this.logout());
    }

    /**
     * Verarbeitet die Authentifizierung
     */
    async handleAuthentication(event) {
        event.preventDefault();
        
        const authCodeInput = document.getElementById('authCode');
        const code = authCodeInput.value.trim();

        if (!code) {
            this.showStatus('Bitte geben Sie einen Code ein', 'error');
            return;
        }

        // Deaktiviere den Button während der Authentifizierung
        this.authForm.querySelector('button').disabled = true;
        this.showStatus('Authentifizierung läuft...', 'info');

        // Sende Authentifizierung zur Firewall
        const result = await firewall.authenticate(code);

        if (result.success) {
            this.showStatus('✓ Authentifizierung erfolgreich!', 'success');
            
            // Zeige Timer-Anwendung nach kurzer Verzögerung
            setTimeout(() => {
                this.showTimerApplication();
            }, 500);
        } else {
            this.showStatus(result.message, 'error');
            authCodeInput.value = '';
            this.authForm.querySelector('button').disabled = false;
        }
    }

    /**
     * Zeigt die Timer-Anwendung an
     */
    showTimerApplication() {
        this.authForm.parentElement.style.display = 'none';
        this.timerApp.classList.remove('hidden');
        
        // Zeige anonymisierte Benutzerinformation
        if (firewall.userEmail) {
            this.userIdentity.textContent = firewall.userEmail;
        } else {
            this.userIdentity.textContent = 'Authentifizierter Benutzer';
        }
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
     * Meldet den Benutzer ab
     */
    logout() {
        if (confirm('Möchten Sie sich wirklich abmelden?')) {
            // Stoppe Timer
            this.reset();
            
            // Beende Firewall-Sitzung
            firewall.logout();

            // Zeige Authentifizierungsformular wieder an
            this.timerApp.classList.add('hidden');
            this.authForm.parentElement.style.display = 'block';
            
            // Lösche die Eingabe
            document.getElementById('authCode').value = '';
            this.authForm.querySelector('button').disabled = false;

            this.showStatus('Sie haben sich abgemeldet', 'info');
        }
    }

    /**
     * Zeigt eine Statusmeldung an
     */
    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message ' + type;
    }
}

// Initialisiere die Timer-Anwendung, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new TimerApplication();
});
