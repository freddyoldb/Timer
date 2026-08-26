/**
 * Firewall Module
 * Verwaltet die Authentifizierung und sichere Kommunikation
 * Der eigentliche Code läuft hinter einer virtuellen Firewall
 */

class FirewallManager {
    constructor() {
        this.isAuthenticated = false;
        this.userToken = null;
        this.firewallEndpoint = '/firewall/api'; // Virtueller Endpunkt hinter der Firewall
        this.sessionTimeout = 30 * 60 * 1000; // 30 Minuten
    }

    /**
     * Authentifizierungsprozess
     * Bei falscher Eingabe wird eine E-Mail-Benachrichtigung simuliert
     */
    async authenticate(code) {
        try {
            // Sende Authentifizierungsanfrage zur Firewall
            const response = await this.sendToFirewall('authenticate', {
                code: code,
                timestamp: new Date().toISOString()
            });

            if (response.success) {
                this.isAuthenticated = true;
                this.userToken = response.token;
                this.userEmail = response.userEmail;
                
                // Starte Sitzungs-Timeout
                this.startSessionTimeout();
                
                return {
                    success: true,
                    message: 'Authentifizierung erfolgreich',
                    token: this.userToken
                };
            } else {
                // Authentifizierung fehlgeschlagen - E-Mail wird versendet
                await this.notifyFirewall('auth_failed', {
                    attemptedCode: code,
                    timestamp: new Date().toISOString()
                });

                return {
                    success: false,
                    message: 'Ungültiger Code. E-Mail mit Firewall-Benachrichtigung an hinterlegte E-Mail-Adresse versendet.',
                    notificationSent: true
                };
            }
        } catch (error) {
            console.error('Firewall-Authentifizierungsfehler:', error);
            return {
                success: false,
                message: 'Verbindung zur Firewall fehlgeschlagen',
                error: error.message
            };
        }
    }

    /**
     * Versendet eine Benachrichtigung hinter der Firewall
     */
    async notifyFirewall(eventType, data) {
        try {
            const response = await this.sendToFirewall('notify', {
                eventType: eventType,
                data: data,
                timestamp: new Date().toISOString()
            });

            if (response.emailSent) {
                console.log(`E-Mail versendet: Firewall-Benachrichtigung an E-Mail-Adresse hinter der Firewall`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Fehler beim Versand der Firewall-Benachrichtigung:', error);
            return false;
        }
    }

    /**
     * Simuliert den Datenaustausch mit der Firewall
     * In einer echten Implementierung würde dies über verschlüsselte API-Aufrufe erfolgen
     */
    async sendToFirewall(action, payload) {
        // Simuliere verzögerte Netzwerkantwort
        return new Promise((resolve) => {
            setTimeout(() => {
                // In einer echten Implementierung würde hier eine echte API-Anfrage erfolgen
                // POST /firewall/api/authenticate
                // POST /firewall/api/notify
                // etc.

                if (action === 'authenticate') {
                    // Authentifizierungslogik hinter der Firewall
                    const correctCode = this.getCorrectCode();
                    
                    if (payload.code === correctCode) {
                        resolve({
                            success: true,
                            token: this.generateToken(),
                            userEmail: this.getMaskedEmail()
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Code nicht korrekt'
                        });
                    }
                }
                
                if (action === 'notify') {
                    // Versende E-Mail-Benachrichtigung
                    resolve({
                        emailSent: true,
                        message: `E-Mail: Firewall-Benachrichtigung zu ${payload.eventType} an E-Mail-Adresse hinter der Firewall versendet`
                    });
                }
            }, 500);
        });
    }

    /**
     * Holt den korrekten Code (dieser bleibt hinter der Firewall verborgen)
     * In Produktion würde dies von einem sicheren Server kommen
     */
    getCorrectCode() {
        // Dies ist nur für Demo-Zwecke - in Produktion kommt dies vom Server
        return '1234'; // Der echte Code wird niemals im Client-seitigen Code sichtbar sein
    }

    /**
     * Generiert ein Token für die Session
     */
    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /**
     * Gibt eine maskierte E-Mail-Adresse zurück
     */
    getMaskedEmail() {
        // In Produktion würde dies vom Server kommen
        return 'benutzer@*****.***';
    }

    /**
     * Startet ein Session-Timeout
     */
    startSessionTimeout() {
        this.sessionTimer = setTimeout(() => {
            this.logout();
            console.log('Sitzung abgelaufen');
        }, this.sessionTimeout);
    }

    /**
     * Beendet die Sitzung
     */
    logout() {
        this.isAuthenticated = false;
        this.userToken = null;
        clearTimeout(this.sessionTimer);
        
        // Benachrichtige Firewall über Logout
        this.notifyFirewall('user_logout', {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Prüft, ob der Benutzer authentifiziert ist
     */
    isUserAuthenticated() {
        return this.isAuthenticated && this.userToken !== null;
    }

    /**
     * Holt gesicherte Daten von hinter der Firewall
     */
    async getSecureData(dataType) {
        if (!this.isUserAuthenticated()) {
            throw new Error('Nicht authentifiziert');
        }

        return await this.sendToFirewall('getData', {
            dataType: dataType,
            token: this.userToken,
            timestamp: new Date().toISOString()
        });
    }
}

// Globale Firewall-Instanz
const firewall = new FirewallManager();
