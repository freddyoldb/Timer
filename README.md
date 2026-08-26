# Timer - Sichere Authentifizierung mit Firewall

Eine moderne Timer-Anwendung mit sicherer Authentifizierung. Der Anwendungscode ist hinter einer virtuellen Firewall verborgen und nur nach erfolgreicher Authentifizierung zugänglich.

## Features

### 🔐 Sicherheit durch Firewall-Architektur
- **Interface-Only Frontend**: Nur die Benutzeroberfläche ist im öffentlichen Quellcode sichtbar
- **Backend Firewall**: Der eigentliche Anwendungscode läuft geschützt hinter der Firewall
- **Token-basierte Sessions**: Sichere Sitzungsverwaltung mit automatischem Timeout

### ⏱️ Timer-Funktionalität
- **Zeitmessung**: Stunden, Minuten und Sekunden
- **Start/Pause/Reset**: Volle Kontrolle über den Timer
- **Session Management**: Automatisches Logout nach Inaktivität

### 📧 Benachrichtigungssystem
- **Firewall-E-Mails**: Bei falscher Authentifizierung wird automatisch eine E-Mail versendet
- **Maskerung**: E-Mail-Adressen werden maskiert angezeigt
- **Sichere Übermittlung**: Benachrichtigungen erfolgen nur über verschlüsselte Firewall-Kanäle

## Architektur

```
┌─────────────────────────────────┐
│   Öffentlich sichtbar           │
│  ┌──────────────────────────┐   │
│  │  Interface (HTML/CSS)    │   │
│  │  - Login-Formular        │   │
│  │  - Timer-UI              │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
           │
     Authentifizierung
           │
           ▼
┌─────────────────────────────────┐
│   Hinter der Firewall           │
│  ┌──────────────────────────┐   │
│  │  Business-Logik          │   │
│  │  - Code-Validierung      │   │
│  │  - Session-Verwaltung    │   │
│  │  - E-Mail-Versand        │   │
│  │  - Echte Timer-Logik     │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Haupt-Interface mit Authentifizierungsformular |
| `style.css` | Styling für die Benutzeroberfläche |
| `firewall.js` | Firewall-Manager für sichere Authentifizierung |
| `timer.js` | Timer-Anwendungslogik (nur nach Auth sichtbar) |
| `README.md` | Diese Dokumentation |

## Verwendung

### Authentifizierung
1. Öffnen Sie `index.html` im Browser
2. Geben Sie Ihren Authentifizierungscode ein
3. Bei erfolgreichem Code: Timer-Interface wird freigeschaltet
4. Bei falschemCode: E-Mail-Benachrichtigung wird versendet (hinter der Firewall)

### Timer-Steuerung
- **Start**: Beginnt die Zeitmessung
- **Pause**: Hält den Timer an
- **Reset**: Setzt die Zeit auf 00:00:00 zurück
- **Abmelden**: Beendet die Sitzung und kehrt zur Anmeldung zurück

## Sicherheitsfeatures

### Authentifizierung
```javascript
// Nur nach erfolgreichem Code wird der Timer freigegeben
firewall.authenticate(code) → {success, token}
```

### E-Mail-Benachrichtigungen
```
Bei falscher Authentifizierung:
E-Mail: Firewall-Benachrichtigung zu auth_failed 
→ an E-Mail-Adresse hinter der Firewall
```

### Session-Timeout
- Automatisches Logout nach 30 Minuten
- Sichere Beendigung aller Prozesse

## Konfidentialität

Die Anwendung arbeitet nach dem Prinzip der **Separation of Concerns**:

- **Öffentlich**: Nur Benutzeroberfläche
- **Privat**: Alle sensiblen Operationen (Code-Prüfung, E-Mail-Versand, echte Logik)
- **Maskiert**: Persönliche Daten werden redaktiert angezeigt
- **Verschlüsselt**: Alle Firewall-Kommunikation ist theoretisch verschlüsselt

## Demo

Zum Testen verwenden Sie:
- **Code**: `1234`

## Lizenz

Dieses Projekt ist privat und geschützt durch die Firewall-Architektur.

## Hinweise zur Produktion

In einer echten Implementierung würde die Firewall-Kommunikation erfolgen über:
- HTTPS mit SSL/TLS-Verschlüsselung
- API-Tokens und OAuth 2.0
- Rate-Limiting und DDoS-Schutz
- Sichere Authentifizierungsprotokolle (2FA, Biometrie)
- Audit-Logging aller Zugriffe
