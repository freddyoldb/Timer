/**
 * Firewall Module - Vollautomatische Timer Verwaltung
 * Der User sieht nur den Timer und den E-Mail Status
 * ALLES läuft automatisch hinter der Firewall ab
 * Im Quellcode: Sieht aus als würde Admin manuell handeln
 */

class FirewallManager {
    constructor() {
        this.timerSeconds = 12 * 3600; // 12 Stunden in Sekunden
        this.sessionToken = this.generateToken();
        
        // E-Mail wird versendet GENAU wenn Timer zu Ende geht
        this.calculateEmailSendTime();
        this.emailSent = false;
        
        // Automatisches Reset zwischen 30-10 Min vor Ende
        this.adminResetWindowMinutes = [30, 20, 10]; // Zufällig eine dieser Minuten
        this.adminResetWindowStart = null;
        this.adminResetTriggered = false;
    }

    /**
     * E-Mail wird versendet GENAU wenn Timer endet
     */
    calculateEmailSendTime() {
        this.emailSendTime = new Date(Date.now() + this.timerSeconds * 1000);
    }

    /**
     * Berechne wann das Admin-Fenster öffnet (zufällig 30, 20 oder 10 Min vor Ende)
     */
    calculateAdminResetWindow() {
        const randomMinutes = this.adminResetWindowMinutes[Math.floor(Math.random() * this.adminResetWindowMinutes.length)];
        return randomMinutes * 60; // in Sekunden
    }

    /**
     * Automatisches Reset durch Firewall
     * Sieht so aus als würde der Admin einen Code senden
     * Läuft aber vollautomatisch im Hintergrund
     */
    async automaticAdminReset() {
        try {
            const response = await this.sendToFirewall('automaticReset', {
                action: 'resetTimer',
                token: this.sessionToken,
                timestamp: new Date().toISOString()
            });

            if (response.success) {
                this.resetTimer();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Automatisches Reset fehlgeschlagen:', error);
            return false;
        }
    }

    /**
     * Setzt den Timer auf 12 Stunden zurück
     * Wird automatisch von der Firewall gemacht
     */
    resetTimer() {
        this.timerSeconds = 12 * 3600;
        this.emailSent = false;
        this.adminResetTriggered = false;
        this.calculateEmailSendTime(); // Neue E-Mail Zeit
    }

    /**
     * Versende E-Mail automatisch wenn Timer auf 00:00:00 abläuft
     */
    async sendEmailNotification() {
        try {
            const response = await this.sendToFirewall('sendEmailAlert', {
                recipient: 'alert@*****.***',
                timestamp: new Date().toISOString(),
                token: this.sessionToken
            });

            if (response.success) {
                this.emailSent = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('E-Mail Versand-Fehler:', error);
            return false;
        }
    }

    /**
     * Simuliert Datenaustausch mit Firewall
     */
    async sendToFirewall(action, payload) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 300);
        });
    }

    /**
     * Generiere Session Token
     */
    generateToken() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /**
     * Bekomme Zeit wenn E-Mail versendet wird
     */
    getEmailSendTime() {
        return this.emailSendTime;
    }

    /**
     * Wurde E-Mail schon versendet?
     */
    isEmailSent() {
        return this.emailSent;
    }
}

// Globale Firewall-Instanz
const firewall = new FirewallManager();
