'use strict';
// ══════════════════════════════════════════════════════════════════════════════
//  DNF Cable Quotation — Synology API Server
//  Run: node server.js
//  Port: 3000 (proxied through Synology reverse proxy on port 443)
// ══════════════════════════════════════════════════════════════════════════════

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');

const app      = express();
const PORT     = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Create data folder if it doesn't exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── SALESMAN ACCOUNTS — Edit here to add / remove / change passwords ──────────
//  Format: { name:'Full Name', user:'username', pass:'password' }
const USERS = [
  { name:'Edwin Lim',   user:'edwin',   pass:'Edwin@123'  },
  { name:'Alice Tan',   user:'alice',   pass:'Alice@123'  },
  { name:'Bob Wong',    user:'bob',     pass:'Bob@123'    },
  { name:'Carol Ng',    user:'carol',   pass:'Carol@123'  },
  { name:'David Lee',   user:'david',   pass:'David@123'  },
];

const SESS_DAYS = 7; // session lasts 7 days

// ── CORS — allow calls from any origin (GitHub Pages, local, etc.) ─────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '20mb' }));

// ── Session file helpers ───────────────────────────────────────────────────────
const SESS_FILE = path.join(DATA_DIR, '_sessions.json');
function loadSess() {
  try { return JSON.parse(fs.readFileSync(SESS_FILE, 'utf8')); } catch { return {}; }
}
function saveSess(s) {
  fs.writeFileSync(SESS_FILE, JSON.stringify(s), 'utf8');
}

// ── Auth middleware ────────────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ ok: false, msg: 'No token' });
  const sess = loadSess();
  const s = sess[token];
  if (!s || s.exp < Date.now()) return res.status(401).json({ ok: false, msg: 'Session expired' });
  req.user = s.user;
  req.name = s.name;
  next();
}

// ── POST /api/login ────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { user, pass } = req.body || {};
  const u = USERS.find(x =>
    x.user.toLowerCase() === (user || '').toLowerCase() && x.pass === pass
  );
  if (!u) return res.json({ ok: false, msg: 'Invalid username or password.' });

  const token = crypto.randomBytes(32).toString('hex');
  const sess  = loadSess();
  const now   = Date.now();

  // Clean up expired sessions
  Object.keys(sess).forEach(k => { if (sess[k].exp < now) delete sess[k]; });

  sess[token] = { user: u.user, name: u.name, exp: now + SESS_DAYS * 86400000 };
  saveSess(sess);

  res.json({ ok: true, token, name: u.name, user: u.user });
});

// ── GET /api/sync — pull all user data ────────────────────────────────────────
app.get('/api/sync', auth, (req, res) => {
  const file = path.join(DATA_DIR, req.user + '.json');
  const data = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : {};
  res.json({ ok: true, data });
});

// ── POST /api/sync — push all user data ───────────────────────────────────────
app.post('/api/sync', auth, (req, res) => {
  const file = path.join(DATA_DIR, req.user + '.json');
  fs.writeFileSync(file, JSON.stringify(req.body.data || {}), 'utf8');
  res.json({ ok: true });
});

// ── POST /api/logout ───────────────────────────────────────────────────────────
app.post('/api/logout', auth, (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  const sess  = loadSess();
  delete sess[token];
  saveSess(sess);
  res.json({ ok: true });
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('DNF API server running on port ' + PORT);
  console.log('Data folder: ' + DATA_DIR);
});
