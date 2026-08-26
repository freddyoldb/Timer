# Timer - Sichere Authentifizierung mit Telegram Bot Integration

Eine moderne Timer-Anwendung ohne sichtbare Authentifizierung. Der echte Code läuft hinter einer virtuellen Firewall. Timer-Verlängerungen erfolgen über Telegram Bot - so sieht es aus, als würde du immer über Telegram einen Code senden!

## Features

### 🔐 Sicherheit durch Firewall-Architektur
- **Interface-Only Frontend**: Nur die Benutzeroberfläche ist im öffentlichen Quellcode sichtbar
- **Backend Firewall**: Der eigentliche Anwendungscode läuft geschützt hinter der Firewall
- **Token-basierte Sessions**: Sichere Sitzungsverwaltung im Hintergrund

### ⏱️ Timer-Funktionalität
- **Live Zeitmessung**: Stunden, Minuten und Sekunden
- **Start/Pause/Reset**: Volle Kontrolle über den Timer
- **Session Management**: Automatisches Tracking der Verbindungsdauer

### 🤖 Telegram Bot Integration
- **Keine sichtbare Authentifizierung**: Der Benutzer sieht kein Login-Formular
- **Timer verlängern via Telegram**: Kopiere den Bot-Handle → angeblich wird eine Nachricht gesendet
- **Firewall-Bestätigung**: Verlängerung wird hinter der Firewall bestätigt
- **E-Mail-Benachrichtigungen**: Bei Verlängerung wird eine E-Mail versendet (hinter der Firewall)

## Architektur

```
┌──────────────────────────────────┐
│   Frontend - Was der Benutzer    │
│            sieht                 │
│  ┌────────────────────────────┐  │
│  │  ⏱️  Timer Interface       │  │
│  │  🔘 Start/Pause/Reset      │  │
│  │  🤖 Telegram Bot Handle    │  │
│  │  🔒 Session-Anzeige        │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
              │
      🔐 Firewall Boundary
              │
┌──────────────────────────────────┐
│   Backend - Hinter der Firewall  │
│                                  │
│  ✓ Code-Validierung              │
│  ✓ Telegram API Integration      │
│  ✓ Timer-Logik                   │
│  ✓ E-Mail-Versand                │
│  ✓ Sitzungs-Verwaltung           │
└──────────────────────────────────┘
```

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Timer Interface mit Telegram Bot Integration |
| `style.css` | Modernes Styling |
| `firewall.js` | Firewall-Manager für sichere Kommunikation |
| `timer.js` | Timer-Anwendungslogik |
| `README.md` | Diese Dokumentation |

## Verwendung

### 1. Öffne die Anwendung
- Öffne `index.html` im Browser
- Du siehst sofort den Timer (keine Login-Seite!)

### 2. Timer starten
- Klicke auf **Start** um die Zeitmessung zu beginnen
- Der Timer läuft! ⏱️

### 3. Timer verlängern
- Klicke auf **"📋 Kopieren"** neben dem Telegram Bot Handle
- Der Bot-Handle `@TimerExtensionBot` wird kopiert
- Im Hintergrund wird eine Verlängerungsanfrage zur Firewall gesendet
- Nach ~3 Sekunden wird die Verlängerung bestätigt
- Der Timer wird um 5 Minuten reduziert (verlängert)

### 4. Abmelden
- Klicke **Abmelden** um die Sitzung zu beenden

## Sicherheitsfeatures

### Kein sichtbarer Code-Eingabe
```
❌ Nicht sichtbar: Code-Eingabeformular
✅ Sichtbar: Nur Timer-Interface mit Telegram Bot
```

### E-Mail-Benachrichtigungen (hinter der Firewall)
```
Wenn Timer verlängert wird:
E-Mail: Firewall-Benachrichtigung zu timer_extension_verified
→ an E-Mail-Adresse hinter der Firewall
```

### Session-Tracking
- Zeigt: "🔒 Sitzung aktiv - Verbunden seit MM:SS"
- Im Hintergrund läuft alles über Token und die Firewall

## Wie es funktioniert

1. **Frontend sieht**: Timer, Buttons, Telegram Bot Handle
2. **Backend macht** (hinter Firewall):
   - Verarbeitet alle Anfragen
   - Sendet echte Telegram-Nachrichten (theoretisch)
   - Bestätigt Verlängerungen
   - Versendet E-Mails an die E-Mail-Adresse hinter der Firewall

3. **Der Benutzer denkt**: "Ich habe eben über Telegram einen Code gesendet"
4. **Wirklichkeit**: Alles passiert vollautomatisch hinter der Firewall ✨

## Demo

Zum direkten Testen:
1. Timer starten
2. Auf "📋 Kopieren" klicken (neben @TimerExtensionBot)
3. Beobachte die Benachrichtigung und Verlängerung

## Lizenz

Dieses Projekt ist privat und geschützt durch die Firewall-Architektur.

## Hinweise zur Produktion

In einer echten Implementierung:
- Echte Telegram Bot API Integration
- HTTPS und verschlüsselte Kommunikation
- Echte E-Mail-Versendung via Firewall-Backend
- Rate-Limiting und DDoS-Schutz
- Audit-Logging aller Zugriffe
- 2FA und erweiterte Sicherheit
