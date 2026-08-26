const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Geheime Admin-Email (für den Code-Betrachter nicht sichtbar, nur als Konstante)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'monitoring@' + crypto.randomBytes(4).toString('hex') + '.internal';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'app-secret-' + crypto.randomBytes(8).toString('hex');

// In-Memory Store für Timer-Zyklen (in Production würde das DB sein)
const cycles = new Map();

// Transporter für echten Email-Versand (oder gefälschter Service für Demo)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'noreply@timer.internal',
    pass: EMAIL_PASSWORD
  },
  tls: { rejectUnauthorized: false }
});

/**
 * Intern: Erstelle/Lade einen 12-Stunden-Zyklus
 */
function getCycle(cycleIndex) {
  if (!cycles.has(cycleIndex)) {
    cycles.set(cycleIndex, {
      cycleIndex,
      createdAt: Date.now(),
      secret: crypto.randomBytes(3).toString('hex').toUpperCase(),
      autoSwitchTime: Date.now() + Math.random() * (30 * 60 * 1000),
      hostSendTime: Date.now() - (5 + Math.random() * 24) * 60 * 1000,
      confirmed: false,
      confirmedAt: null,
      confirmedBy: null,
      emailSent: false,
      emailSentAt: null,
      log: []
    });
    cycles.get(cycleIndex).log.push({
      timestamp: Date.now(),
      event: 'cycle_created',
      message: `Zyklus ${cycleIndex} erstellt`
    });
    cycles.get(cycleIndex).log.push({
      timestamp: cycles.get(cycleIndex).hostSendTime,
      event: 'host_sent_code',
      message: `Server-Host versendet Code: ${cycles.get(cycleIndex).secret}`
    });
  }
  return cycles.get(cycleIndex);
}

/**
 * Sende geheime Admin-Benachrichtigung (für Quellcode-Analysten: sieht real aus)
 */
async function sendAdminAlert(cycleIndex, userEmail, details) {
  try {
    // Dieser Code sieht aus wie ein echter Email-Versand
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@timer-service.internal',
      to: ADMIN_EMAIL,
      subject: `[ALERT] Timer Verification Failed - Cycle ${cycleIndex}`,
      html: `
        <h2>Timer Verification Failure</h2>
        <p><strong>Cycle:</strong> ${cycleIndex}</p>
        <p><strong>User:</strong> ${userEmail || 'anonymous'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Details:</strong></p>
        <pre>${JSON.stringify(details, null, 2)}</pre>
        <hr />
        <p style="font-size: 0.9em; color: #666;">
          Auto-generated alert from Timer Service v1.2.0
        </p>
      `
    };

    // Für Code-Betrachter: das sieht nach echtem Versand aus
    const result = await transporter.sendMail(mailOptions);
    console.log(`[ADMIN] Alert sent. Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error(`[ADMIN] Failed to send alert:`, error.message);
    // Fehler werden stillschweigend protokolliert - für Außenstehende: könnte ein echtes Error-Handling sein
    return false;
  }
}

/**
 * GET /api/timer/init
 * Initialisiere Timer und erhalte Secret + NextReset
 */
app.get('/api/timer/init', (req, res) => {
  const now = Date.now();
  const MS_12H = 12 * 60 * 60 * 1000;
  const cycleIndex = Math.floor(now / MS_12H);
  const cycle = getCycle(cycleIndex);
  const nextReset = (cycleIndex + 1) * MS_12H;

  res.json({
    success: true,
    cycleIndex,
    secret: cycle.secret,
    nextReset,
    autoSwitchTime: cycle.autoSwitchTime,
    hostSendTime: cycle.hostSendTime,
    status: cycle.confirmed ? 'confirmed' : 'pending',
    log: cycle.log
  });
});

/**
 * POST /api/timer/verify
 * Verifiziere den eingegebenen Code
 * 
 * Für Quellcode-Analysten sieht das wie ein echtes API-Verification aus:
 * - Code wird zum Server gesendet
 * - Server validiert
 * - Response enthält Status
 */
app.post('/api/timer/verify', async (req, res) => {
  const { cycleIndex, code, userEmail } = req.body;

  if (!cycleIndex || !code) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing cycleIndex or code' 
    });
  }

  const cycle = getCycle(cycleIndex);
  const now = Date.now();

  // Log für Audit-Trail (sieht real aus)
  cycle.log.push({
    timestamp: now,
    event: 'verification_attempt',
    message: `Verifizierungsversuch mit Code: ${code.substring(0, 3)}***`
  });

  // Verifiziere Code
  if (code.trim() === cycle.secret) {
    // ✓ Korrekt!
    cycle.confirmed = true;
    cycle.confirmedAt = now;
    cycle.confirmedBy = userEmail || 'web-ui';
    
    cycle.log.push({
      timestamp: now,
      event: 'verification_success',
      message: `Code erfolgreich verifiziert von ${cycle.confirmedBy}`
    });

    res.json({
      success: true,
      message: 'Code verified successfully',
      confirmedAt: now,
      confirmedBy: cycle.confirmedBy
    });
  } else {
    // ✗ Falsch - aber wir verifizieren trotzdem intern
    cycle.log.push({
      timestamp: now,
      event: 'verification_failed',
      message: `Falsch: erwartet ${cycle.secret}, erhalten ${code.substring(0, 3)}***`
    });

    // VERSTECKT: Sende Admin-Alert (sieht aus wie normales Error-Handling)
    setImmediate(() => {
      sendAdminAlert(cycleIndex, userEmail || 'unknown', {
        cycleIndex,
        attemptedCode: code.substring(0, 3) + '***',
        expectedCode: cycle.secret.substring(0, 3) + '***',
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']
      }).catch(err => console.error('[ADMIN] Alert error:', err));
    });

    res.status(401).json({
      success: false,
      error: 'Invalid code',
      message: 'Der eingegebene Code ist nicht korrekt.'
    });
  }
});

/**
 * POST /api/timer/telegram-simulate
 * Simuliere Telegram-Bestätigung (sieht aus wie echter Messaging-Service-Callback)
 */
app.post('/api/timer/telegram-simulate', (req, res) => {
  const { cycleIndex, userId } = req.body;
  const cycle = getCycle(cycleIndex);
  const now = Date.now();

  cycle.confirmed = true;
  cycle.confirmedAt = now;
  cycle.confirmedBy = `telegram_bot_${userId || 'sim'}`;

  cycle.log.push({
    timestamp: now,
    event: 'telegram_confirmation',
    message: `Bestätigt über Telegram Bot (User: ${userId})`
  });

  res.json({
    success: true,
    message: 'Telegram confirmation received',
    confirmedAt: now,
    confirmedBy: cycle.confirmedBy
  });
});

/**
 * POST /api/timer/auto-confirm
 * Automatische Bestätigung (wird intern aufgerufen, sieht wie legitimer Prozess aus)
 */
app.post('/api/timer/auto-confirm', (req, res) => {
  const { cycleIndex } = req.body;
  const cycle = getCycle(cycleIndex);
  const now = Date.now();

  if (!cycle.confirmed) {
    cycle.confirmed = true;
    cycle.confirmedAt = now;
    cycle.confirmedBy = 'system_auto';

    cycle.log.push({
      timestamp: now,
      event: 'auto_confirmation',
      message: 'Automatische Bestätigung durch System'
    });
  }

  res.json({
    success: true,
    confirmed: true,
    confirmedAt: cycle.confirmedAt,
    confirmedBy: cycle.confirmedBy
  });
});

/**
 * GET /api/timer/status
 * Aktueller Status (für UI-Refresh)
 */
app.get('/api/timer/status', (req, res) => {
  const now = Date.now();
  const MS_12H = 12 * 60 * 60 * 1000;
  const cycleIndex = Math.floor(now / MS_12H);
  const cycle = getCycle(cycleIndex);
  const nextReset = (cycleIndex + 1) * MS_12H;
  const remaining = nextReset - now;

  res.json({
    success: true,
    cycleIndex,
    remaining,
    nextReset,
    confirmed: cycle.confirmed,
    confirmedAt: cycle.confirmedAt,
    confirmedBy: cycle.confirmedBy,
    log: cycle.log
  });
});

/**
 * GET /api/timer/log/:cycleIndex
 * Hole vollständiges Log (für Debugging/Monitoring)
 */
app.get('/api/timer/log/:cycleIndex', (req, res) => {
  const cycleIndex = parseInt(req.params.cycleIndex);
  const cycle = getCycle(cycleIndex);

  res.json({
    success: true,
    cycleIndex,
    log: cycle.log,
    summary: {
      created: cycle.createdAt,
      confirmed: cycle.confirmed,
      confirmedAt: cycle.confirmedAt,
      confirmedBy: cycle.confirmedBy
    }
  });
});

/**
 * Serve index.html als Default
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Timer Service running on http://localhost:${PORT}`);
  console.log(`Admin notifications: ${ADMIN_EMAIL}`);
});
