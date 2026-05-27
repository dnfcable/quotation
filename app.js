'use strict';
// ═══════════════════════════════════════════════════════════════════════════
//  DNF Cable Quotation Mobile App
//  Vanilla JS PWA – no external dependencies
// ═══════════════════════════════════════════════════════════════════════════

// ─── Cable Data ────────────────────────────────────────────────────────────
const CATEGORY_META = {
  // Copper single-core
  "CU/PVC 1c":              { header: "CU/PVC 450/750V Cable",             cores: "1c" },
  "CU/XLPE/PVC 1c":         { header: "CU/XLPE/PVC 600/1000V Cable",       cores: "1c" },
  // Copper armoured
  "CU 4c Armoured":         { header: "CU 4 Core Armoured 600/1000V Cable",cores: "4c", isMix: true },
  "CU/PVC/SWA/PVC 3c":      { header: "CU/PVC/SWA/PVC 600/1000V Cable",   cores: "3c" },
  "CU/PVC/SWA/PVC 2c":      { header: "CU/PVC/SWA/PVC 600/1000V Cable",   cores: "2c" },
  "CU Arm Multicore 1.5mm²":{ header: "CU/PVC/SWA/PVC 600/1000V Cable",   cores: ""   },
  "CU Arm Multicore 2.5mm²":{ header: "CU/PVC/SWA/PVC 600/1000V Cable",   cores: ""   },
  // Copper non-armoured
  "CU/XLPE/PVC 4c":         { header: "CU/XLPE/PVC 600/1000V Cable",      cores: "4c" },
  "CU/PVC/PVC 4c":          { header: "CU/PVC/PVC 600/1000V Cable",       cores: "4c" },
  "CU/XLPE/PVC 3c":         { header: "CU/XLPE/PVC 600/1000V Cable",      cores: "3c" },
  "CU/PVC/PVC 3c":          { header: "CU/PVC/PVC 600/1000V Cable",       cores: "3c" },
  "CU/XLPE/PVC 2c":         { header: "CU/XLPE/PVC 600/1000V Cable",      cores: "2c" },
  "CU/PVC/PVC 2c":          { header: "CU/PVC/PVC 600/1000V Cable",       cores: "2c" },
  // Aluminium
  "ALU/PVC 1c":             { header: "AL/PVC 450/750V Cable",             cores: "1c" },
  "ALU/XLPE/PVC 1c":        { header: "AL/XLPE/PVC 600/1000V Cable",      cores: "1c" },
  "ALU/XLPE/SWA/PVC 4c":   { header: "AL/XLPE/SWA/PVC 600/1000V Cable",  cores: "4c" },
  "ALU/XLPE/SWA/PVC 3c":   { header: "AL/XLPE/SWA/PVC 600/1000V Cable",  cores: "3c" },
  "ALU/XLPE/SWA/PVC 2c":   { header: "AL/XLPE/SWA/PVC 600/1000V Cable",  cores: "2c" },
  // FR cables
  "CU/Mica/PVC-FR":         { header: "CU/MICA/PVC FR Cable",             cores: "1c" },
  "CU/Mica/XLPE/PVC-FR":    { header: "CU/MICA/XLPE/PVC FR Cable",       cores: "1c" },
  "CU/Mica/XLPE/LSZH":      { header: "CU/MICA/XLPE/LSZH FR Cable",      cores: "1c" },
  "CU/Mica/XLPO-LSZH":      { header: "CU/MICA/XLPO/LSZH FR Cable",      cores: "1c" },
};

const CABLE_GROUPS = {
  "CU":  { label: "Copper",         keys: ["CU/PVC 1c","CU/XLPE/PVC 1c","CU 4c Armoured","CU/PVC/SWA/PVC 3c","CU/PVC/SWA/PVC 2c","CU Arm Multicore 1.5mm²","CU Arm Multicore 2.5mm²","CU/XLPE/PVC 4c","CU/PVC/PVC 4c","CU/XLPE/PVC 3c","CU/PVC/PVC 3c","CU/XLPE/PVC 2c","CU/PVC/PVC 2c"] },
  "ALU": { label: "Aluminium",      keys: ["ALU/PVC 1c","ALU/XLPE/PVC 1c","ALU/XLPE/SWA/PVC 4c","ALU/XLPE/SWA/PVC 3c","ALU/XLPE/SWA/PVC 2c"] },
  "FR":  { label: "Fire Resistant", keys: ["CU/Mica/PVC-FR","CU/Mica/XLPE/PVC-FR","CU/Mica/XLPE/LSZH","CU/Mica/XLPO-LSZH"] },
};

const SIZES_1C = ["1.5mm²","2.5mm²","4mm²","6mm²","10mm²","16mm²","25mm²","35mm²","50mm²","70mm²","95mm²","120mm²","150mm²","185mm²","240mm²","300mm²","400mm²","500mm²","630mm²"];
const SIZES_4C_ARMOURED = ["1.5mm²","2.5mm²","4mm²","6mm²","10mm²","16mm² (PSP)","16mm²","25mm² (PSP)","25mm²","35mm²","50mm²","70mm²","95mm²","120mm²","150mm²","185mm²","240mm²","300mm²","400mm²"];
const SIZES_3C_2C_ARM = ["1.5mm²","2.5mm²","4mm²","6mm²","10mm²","16mm²","25mm²"];
const SIZES_MULTICORE = ["2c","3c","4c","5c","6c","7c","8c","10c","12c","14c","16c","19c","24c","27c","30c","37c"];
const SIZES_4C_MULTI = ["1.5mm²","2.5mm²","4mm²","6mm²","10mm²","16mm²","25mm²","35mm²","50mm²","70mm²","95mm²","120mm²","150mm²","185mm²","240mm²","300mm²","400mm²"];
const SIZES_ALU = ["16mm²","25mm²","35mm²","50mm²","70mm²","95mm²","120mm²","150mm²","185mm²","240mm²","300mm²","400mm²","500mm²","630mm²"];
const SIZES_ALU_ARMOURED = ["16mm²","25mm²","35mm²","50mm²","70mm²","95mm²","120mm²","150mm²","185mm²","240mm²","300mm²","400mm²"];
const SIZES_FR = ["1.5mm²","2.5mm²","4mm²","6mm²","10mm²","16mm²","25mm²","35mm²","50mm²","70mm²","95mm²","120mm²","150mm²","185mm²","240mm²","300mm²","400mm²","500mm²","630mm²"];

function sizesFor(cat) {
  if (["CU/PVC 1c","CU/XLPE/PVC 1c","ALU/PVC 1c","ALU/XLPE/PVC 1c"].includes(cat)) return SIZES_1C;
  if (cat === "CU 4c Armoured") return SIZES_4C_ARMOURED;
  if (["CU/PVC/SWA/PVC 3c","CU/PVC/SWA/PVC 2c"].includes(cat)) return SIZES_3C_2C_ARM;
  if (["CU Arm Multicore 1.5mm²","CU Arm Multicore 2.5mm²"].includes(cat)) return SIZES_MULTICORE;
  if (["CU/XLPE/PVC 4c","CU/PVC/PVC 4c","CU/XLPE/PVC 3c","CU/PVC/PVC 3c","CU/XLPE/PVC 2c","CU/PVC/PVC 2c"].includes(cat)) return SIZES_4C_MULTI;
  if (["ALU/XLPE/SWA/PVC 4c","ALU/XLPE/SWA/PVC 3c","ALU/XLPE/SWA/PVC 2c"].includes(cat)) return SIZES_ALU_ARMOURED;
  if (cat.includes("/Mica/")) return SIZES_FR;
  return SIZES_1C;
}

const CU_TIERS  = ["+3","+2","+1","+0","-1","-2","Below 100m","Below 50m"];
const ALU_TIERS = ["+3","+2","+1","+0","-1","-2","-3","Below 200m","Below 100m"];
const FR_TIERS  = ["+3","+2","+1","+0","-1","-2"];

function tiersFor(cat) {
  if (cat.startsWith("ALU")) return ALU_TIERS;
  if (cat.includes("/Mica/")) return FR_TIERS;
  return CU_TIERS;
}

const COLOURS = ["","Black","Red","Yellow","Blue","Green","Brown","Grey","White","Orange","Green/Yellow"];
const UNITS   = ["Meter","Coil","Drum","Roll","Set","Nos","Length"];
const DRUM_PRICE = 150.0;
const SST_RATE   = 0.10;

const WA_FOOTER = `*DNF Cable Sdn Bhd*

• Drum RM150 + 10% SST, if any (D) beside pricing.
• Prices are subject to 10% SST.
• Sales on first-come, first-served basis.
• Prices valid until 5pm daily.
• Delivery charges may apply for orders below RM3k.
• Additional charges for site delivery.`;

// ─── Storage ───────────────────────────────────────────────────────────────
const DB = {
  _k: k => 'dnf_' + k,
  get: (k, def=null) => { try { const v=localStorage.getItem(DB._k(k)); return v!==null?JSON.parse(v):def; } catch { return def; }},
  set: (k, v) => { try { localStorage.setItem(DB._k(k), JSON.stringify(v)); } catch {} },
  customers:    ()  => DB.get('customers', []),
  saveCustomers:(v) => DB.set('customers', v),
  customCables: ()  => DB.get('custom_cables', []),
  saveCustomCables:(v) => DB.set('custom_cables', v),
  history:      ()  => DB.get('history', []),
  saveHistory:  (v) => DB.set('history', v),
  settings:     ()  => DB.get('settings', { salesman:'Edwin Lim', sst:true, priceDate:'', prices:{} }),
  saveSettings: (v) => DB.set('settings', v),
  prices:       ()  => DB.get('prices', {}),
  savePrices:   (v) => DB.set('prices', v),
};

// ─── State ─────────────────────────────────────────────────────────────────
const state = {
  tab:        'quote',
  customer:   null,          // { company, attn, tel, email }
  items:      [],            // array of item objects
  refNo:      '',
  quoteDate:  '',
  modalOpen:  false,
  editIdx:    -1,            // -1 = new item
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls) e.className=cls; if(html!==undefined) e.innerHTML=html; return e; };
const fmt = n => 'RM ' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmtNum = n => Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function today() {
  const d = new Date();
  return [String(d.getDate()).padStart(2,'0'), String(d.getMonth()+1).padStart(2,'0'), d.getFullYear()].join('/');
}

function genRef() {
  const d = new Date();
  const prefix = String(d.getFullYear()).slice(2) + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  const hist = DB.history();
  const todayRefs = hist.filter(h => h.ref.startsWith(prefix));
  const seq = todayRefs.length + 1;
  return prefix + String(seq).padStart(3,'0');
}

function toast(msg, dur=2200) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), dur);
}

function fmtPhone(raw) {
  const d = raw.replace(/\D/g,'');
  if (d.startsWith('60')) return d;
  if (d.startsWith('0')) return '60' + d.slice(1);
  return '60' + d;
}

function initials(name) {
  return (name||'?').split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase() || '?';
}

// ─── WA description builder ────────────────────────────────────────────────
function buildWaDesc(it) {
  const cat  = it.category || '';
  const size = it.size || '';
  const clean = size.replace(/\s*\(PSP\)$/, '');
  const meta = CATEGORY_META[cat];
  if (!meta) return it.customName || size;

  if (cat === 'CU 4c Armoured') {
    const num = parseFloat(clean);
    const spec = (cat.includes('(PSP)') || num <= 10) ? 'PVC/SWA/PVC' : 'XLPE/SWA/PVC';
    return `${clean} x 4c CU/${spec}`;
  }
  if (meta.cores) return `${clean} x ${meta.cores} ${cat.replace(/ \d+c$/, '')}`;
  return `${clean} ${cat}`;
}

// ─── Price lookup from stored price DB ────────────────────────────────────
function lookupPrice(cat, size, tier) {
  const db = DB.prices();
  return db[cat]?.[size]?.[tier] || null;
}

// ─── Compute selling price ─────────────────────────────────────────────────
function calcSell(base, markupPct) {
  if (!base || isNaN(base)) return null;
  const m = parseFloat(markupPct) || 0;
  if (m === 0) return base;
  return base / (1 - m / 100);
}

// ─── Item totals ───────────────────────────────────────────────────────────
function itemAmount(it) { return (it.price || 0) * (it.qty || 0); }

function quoteTotals() {
  let sub = state.items.reduce((s, it) => s + itemAmount(it), 0);
  const drumCount = state.items.filter(it => it.drum).length;
  const drumAmt   = drumCount * DRUM_PRICE;
  const settings  = DB.settings();
  const sst = settings.sst ? (sub + drumAmt) * SST_RATE : 0;
  return { sub, drumCount, drumAmt, sst, total: sub + drumAmt + sst };
}

// ─── WhatsApp message builder ──────────────────────────────────────────────
function buildWaMessage() {
  const lines = [];
  state.items.forEach(it => {
    const stock = it.stock || 'exstock';
    const prefix = stock === 'no need to check' ? '' : stock === 'exstock' ? '✅' : '❌';
    const desc  = it.waDesc || buildWaDesc(it);
    const unit  = it.unit === 'Meter' ? 'mtr' : (it.unit||'').toLowerCase();
    const drum  = it.drum ? '(D)' : '';
    lines.push(`${prefix}${desc} - ${+it.qty}${unit}`);
    lines.push(`RM${(+it.price).toFixed(2)}/${unit}${drum}`);
    lines.push('');
  });
  lines.push(WA_FOOTER);
  return lines.join('\n');
}

// ─── Modal ────────────────────────────────────────────────────────────────
function openModal(contentHtml, { title='', onClose=null }={}) {
  state.modalOpen = true;
  const overlay = $('modal-overlay');
  const sheet   = $('modal-sheet');
  const content = $('modal-content');

  content.innerHTML = `
    <div class="sheet-header">
      <span class="sheet-title">${title}</span>
      <button class="btn-icon dark" id="btn-close-modal">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    ${contentHtml}
  `;

  overlay.classList.remove('hidden');
  sheet.classList.remove('hidden');

  const close = () => {
    overlay.classList.add('hidden');
    sheet.classList.add('hidden');
    state.modalOpen = false;
    onClose && onClose();
  };
  $('btn-close-modal').onclick = close;
  overlay.onclick = close;
}

function closeModal() {
  $('modal-overlay').classList.add('hidden');
  $('modal-sheet').classList.add('hidden');
  state.modalOpen = false;
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: QUOTE
// ═══════════════════════════════════════════════════════════════════════════
function renderQuoteTab() {
  $('page-title').textContent = 'DNF Quotation';
  $('btn-back').classList.add('hidden');
  updatePriceBadge();

  const hdr = $('header-actions');
  hdr.innerHTML = `
    <button class="btn-icon" id="btn-wa-preview" title="Preview WhatsApp message">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>
    <button class="btn-icon" id="btn-new-quote" title="New quotation">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
  `;

  const main = $('main');
  main.innerHTML = '';

  const page = el('div', 'quote-page');

  // ── Meta strip (ref / date) ──
  state.refNo    = state.refNo    || genRef();
  state.quoteDate= state.quoteDate|| today();
  const meta = el('div','meta-strip');
  meta.innerHTML = `<span>Ref: <b>${state.refNo}</b></span><span>${state.quoteDate}</span>`;
  page.appendChild(meta);

  // ── Customer strip ──
  const strip = el('div','cust-strip');
  if (state.customer) {
    strip.innerHTML = `
      <div class="cust-avatar">${initials(state.customer.company)}</div>
      <div class="cust-strip-info">
        <div class="cust-name">${state.customer.company}</div>
        <div class="cust-phone">${state.customer.attn ? state.customer.attn + ' · ' : ''}${state.customer.tel||''}</div>
      </div>
      <button class="btn btn-sm btn-ghost" id="btn-change-cust">Change</button>
    `;
  } else {
    strip.innerHTML = `
      <div style="font-size:26px">👤</div>
      <div class="cust-placeholder" style="flex:1">Tap to select customer</div>
      <button class="btn btn-sm btn-primary" id="btn-change-cust">Select</button>
    `;
  }
  page.appendChild(strip);

  // ── Items ──
  if (state.items.length === 0) {
    const emp = el('div','empty-state');
    emp.innerHTML = `<div class="empty-icon">📋</div><div class="empty-msg">No items yet.<br>Tap + to add a cable item.</div>`;
    page.appendChild(emp);
  } else {
    const sec = el('div','items-section');
    const lbl = el('div','section-label');
    lbl.textContent = `Items (${state.items.length})`;
    sec.appendChild(lbl);

    state.items.forEach((it, idx) => {
      sec.appendChild(buildItemCard(it, idx));
    });

    // Drum row
    const drumCount = state.items.filter(it => it.drum).length;
    if (drumCount > 0) {
      const dr = el('div','drum-row');
      dr.innerHTML = `
        <div>
          <div style="font-weight:700;font-size:14px">🥁 Drum Charges</div>
          <div class="text-sm text-muted">${drumCount} drum${drumCount>1?'s':''} × RM${DRUM_PRICE.toFixed(2)}</div>
        </div>
        <div style="font-weight:700;font-size:15px">${fmt(drumCount * DRUM_PRICE)}</div>
      `;
      sec.appendChild(dr);
    }

    page.appendChild(sec);

    // ── Totals ──
    const { sub, drumAmt, sst, total } = quoteTotals();
    const settings = DB.settings();
    const totPanel = el('div','total-panel');
    totPanel.innerHTML = `
      <div class="total-row">
        <span class="total-label">Sub Total</span>
        <span class="total-value">${fmt(sub + drumAmt)}</span>
      </div>
      ${settings.sst ? `<div class="total-row">
        <span class="total-label">SST (10%)</span>
        <span class="total-value">${fmt(sst)}</span>
      </div>` : ''}
      <div class="total-row grand">
        <span class="total-label">TOTAL</span>
        <span class="total-value">${fmt(total)}</span>
      </div>
    `;
    page.appendChild(totPanel);

    // ── Action buttons ──
    const actRow = el('div','action-row');
    actRow.innerHTML = `
      <button class="btn btn-wa btn-full" id="btn-send-wa" style="font-size:15px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Send via WhatsApp
      </button>
      <button class="btn btn-ghost" id="btn-save-hist" style="white-space:nowrap">
        💾 Save
      </button>
      <button class="btn btn-blue" id="btn-gen-quotation" style="white-space:nowrap">
        📄 Quotation File
      </button>
    `;
    page.appendChild(actRow);
  }

  main.appendChild(page);

  // FAB
  let fab = document.querySelector('.fab');
  if (!fab) {
    fab = el('button','fab');
    fab.innerHTML = '+';
    document.getElementById('app').appendChild(fab);
  }
  fab.classList.remove('hidden');
  fab.onclick = () => openItemModal(-1);

  // Events
  $('btn-new-quote')?.addEventListener('click', confirmNewQuote);
  $('btn-wa-preview')?.addEventListener('click', showWaPreview);
  $('btn-change-cust')?.addEventListener('click', showCustomerPicker);
  $('btn-send-wa')?.addEventListener('click', sendWhatsApp);
  $('btn-save-hist')?.addEventListener('click', saveToHistory);
  $('btn-gen-quotation')?.addEventListener('click', generateQuotation);
}

function buildItemCard(it, idx) {
  const card = el('div','item-card');
  card.dataset.idx = idx;

  const stock = it.stock || 'exstock';
  const dotCls = stock==='exstock'?'ex' : stock==='no stock'?'no':'skip';
  const dotTitle = stock==='exstock'?'In stock' : stock==='no stock'?'No stock':'';
  const amount = itemAmount(it);
  const sub = it.category && CATEGORY_META[it.category];
  const desc = sub ? (sub.cores ? `${sub.cores} × ${it.size}` : it.size) + (it.colour ? ` (${it.colour})` : '') : it.customName || it.size;
  const catLabel = it.isCustom ? '[Custom] ' + (it.customName||'') : it.category || '';

  const inner = el('div','item-card-inner');
  inner.innerHTML = `
    <div class="item-num">${idx+1}</div>
    <div class="item-info">
      <div class="item-desc">${desc}</div>
      <div class="item-sub"><span class="stock-dot ${dotCls}" title="${dotTitle}"></span>${catLabel}${it.drum ? ' · 🥁' : ''}${it.remarks ? ' · ' + it.remarks : ''}</div>
    </div>
    <div class="item-amount">
      <div class="item-price">${fmt(amount)}</div>
      <div class="item-qty-unit">${+it.qty} ${it.unit||'Meter'} × RM${(+it.price).toFixed(4)}</div>
    </div>
  `;

  const actions = el('div','item-actions');
  actions.innerHTML = `
    <button class="item-act-btn item-act-edit" data-idx="${idx}">✎ Edit</button>
    <button class="item-act-btn item-act-copy" data-idx="${idx}">⧉ Copy</button>
    <button class="item-act-btn item-act-del"  data-idx="${idx}">🗑 Delete</button>
  `;

  card.appendChild(inner);
  card.appendChild(actions);

  inner.addEventListener('click', () => {
    // toggle expand
    const wasExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.item-card.expanded').forEach(c => c.classList.remove('expanded'));
    if (!wasExpanded) card.classList.add('expanded');
  });

  actions.querySelector('.item-act-edit').addEventListener('click', e => { e.stopPropagation(); openItemModal(idx); });
  actions.querySelector('.item-act-copy').addEventListener('click', e => { e.stopPropagation(); copyItem(idx); });
  actions.querySelector('.item-act-del').addEventListener('click', e => { e.stopPropagation(); deleteItem(idx); });

  return card;
}

function copyItem(idx) {
  const copy = JSON.parse(JSON.stringify(state.items[idx]));
  state.items.splice(idx + 1, 0, copy);
  renderQuoteTab();
  toast('Item duplicated');
}

function deleteItem(idx) {
  state.items.splice(idx, 1);
  renderQuoteTab();
  toast('Item removed');
}

function confirmNewQuote() {
  if (state.items.length === 0) { resetQuote(); return; }
  if (confirm('Start a new quotation? Current items will be cleared.')) resetQuote();
}

function resetQuote() {
  state.items    = [];
  state.customer = null;
  state.refNo    = genRef();
  state.quoteDate = today();
  renderQuoteTab();
}

function saveToHistory() {
  if (state.items.length === 0) { toast('Add items first'); return; }
  const hist = DB.history();
  const { total } = quoteTotals();
  const entry = {
    id:       Date.now(),
    ref:      state.refNo,
    date:     state.quoteDate,
    customer: state.customer ? { ...state.customer } : null,
    items:    JSON.parse(JSON.stringify(state.items)),
    total,
  };
  hist.unshift(entry);
  DB.saveHistory(hist.slice(0, 100));
  toast('Quotation saved to history ✓');
}

// ─── Customer picker (quick select in quote) ──────────────────────────────
function showCustomerPicker() {
  const customers = DB.customers();
  const rows = customers.map((c,i) => `
    <div class="cust-item" data-idx="${i}" style="cursor:pointer">
      <div class="cust-avatar">${initials(c.company)}</div>
      <div class="cust-item-info">
        <div class="cust-company">${c.company}</div>
        <div class="cust-detail">${c.attn||''} ${c.tel ? '· ' + c.tel : ''}</div>
      </div>
    </div>
  `).join('');

  openModal(`
    <div style="padding:10px 16px">
      <input class="form-control" id="cust-picker-search" placeholder="Search customer..." style="margin-bottom:8px">
    </div>
    <div id="cust-picker-list" style="max-height:55vh;overflow-y:auto">
      ${rows || '<div style="padding:20px;text-align:center;color:var(--muted)">No customers yet. Add in the Customers tab.</div>'}
    </div>
    <div class="sheet-footer">
      <button class="btn btn-ghost btn-full" id="btn-no-customer">No Customer (Walk-in)</button>
    </div>
  `, { title: 'Select Customer' });

  // Filter
  $('cust-picker-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    $('cust-picker-list').querySelectorAll('.cust-item').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });

  $('cust-picker-list').addEventListener('click', e => {
    const row = e.target.closest('[data-idx]');
    if (!row) return;
    state.customer = customers[+row.dataset.idx];
    closeModal();
    renderQuoteTab();
  });
  $('btn-no-customer').addEventListener('click', () => {
    state.customer = null;
    closeModal();
    renderQuoteTab();
  });
}

// ─── WhatsApp actions ─────────────────────────────────────────────────────
function sendWhatsApp() {
  if (state.items.length === 0) { toast('Add items first'); return; }
  const phone = state.customer?.tel || '';
  const msg   = buildWaMessage();

  if (!phone) {
    // Show preview + manual phone input
    showWaPreview(true);
    return;
  }
  const url = `https://wa.me/${fmtPhone(phone)}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function showWaPreview(showSend=false) {
  if (state.items.length === 0) { toast('Add items first'); return; }
  const msg = buildWaMessage();
  const phone = state.customer?.tel || '';

  openModal(`
    <div class="sheet-body">
      <div class="wa-preview" id="wa-preview-text">${escHtml(msg)}</div>
      ${showSend ? `
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input class="form-control" id="wa-phone-input" type="tel" placeholder="e.g. 0123456789" value="${escHtml(phone)}">
        </div>
      ` : ''}
    </div>
    <div class="sheet-footer">
      <button class="btn btn-ghost btn-sm" id="btn-copy-wa">📋 Copy</button>
      ${showSend ? `<button class="btn btn-wa btn-full" id="btn-do-send-wa">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Open in WhatsApp
      </button>` : ''}
    </div>
  `, { title: '💬 WhatsApp Message' });

  $('btn-copy-wa')?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).then(() => toast('Copied to clipboard ✓'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = msg; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      toast('Copied to clipboard ✓');
    }
  });
  $('btn-do-send-wa')?.addEventListener('click', () => {
    const p = $('wa-phone-input')?.value.trim() || '';
    if (!p) { toast('Enter phone number'); return; }
    const url = `https://wa.me/${fmtPhone(p)}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Generate Quotation HTML File ─────────────────────────────────────────
function generateQuotation() {
  if (state.items.length === 0) { toast('Add items first'); return; }

  const settings  = DB.settings();
  const cust      = state.customer || {};
  const { sub, drumCount, drumAmt, sst, total } = quoteTotals();
  const sstPct    = settings.sst ? 10 : 0;

  // Format date from DD/MM/YYYY → DD.MM.YYYY
  const dateFormatted = (state.quoteDate || today()).replace(/\//g, '.');
  const salesman  = escHtml(settings.salesman || '');

  // Build item rows HTML
  const itemRowsHtml = state.items.map((it, idx) => {
    const desc     = escHtml(it.waDesc || buildWaDesc(it) || '');
    const remarks  = it.remarks ? ` (${escHtml(it.remarks)})` : '';
    const fullDesc = desc + remarks + (it.drum ? ' [Drum]' : '');
    const uom      = escHtml(it.unit || 'Meter');
    const qty      = +it.qty;
    const price    = +it.price;
    const amount   = qty * price;
    const rowBg    = idx % 2 === 0 ? '#F3F5F7' : '#ffffff';
    return `
      <tr style="background:${rowBg};">
        <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:center;font-size:7.5pt;">${idx + 1}</td>
        <td style="border:1px solid #C7CDD4;padding:4px 5px;font-size:7.5pt;">${fullDesc}</td>
        <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:center;font-size:7.5pt;">${uom}</td>
        <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:right;font-size:7.5pt;">${qty.toLocaleString('en-MY')}</td>
        <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:right;font-size:7.5pt;">${price.toFixed(2)}</td>
        <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:right;font-size:7.5pt;">RM ${amount.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
      </tr>`;
  }).join('');

  // Drum charge row (if any)
  const drumRowHtml = drumCount > 0 ? `
    <tr style="background:#FFF8E1;">
      <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:center;font-size:7.5pt;"></td>
      <td style="border:1px solid #C7CDD4;padding:4px 5px;font-size:7.5pt;">Drum Charges (${drumCount} drum${drumCount>1?'s':''})</td>
      <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:center;font-size:7.5pt;">Nos</td>
      <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:right;font-size:7.5pt;">${drumCount}</td>
      <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:right;font-size:7.5pt;">${DRUM_PRICE.toFixed(2)}</td>
      <td style="border:1px solid #C7CDD4;padding:4px 3px;text-align:right;font-size:7.5pt;">RM ${drumAmt.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
    </tr>` : '';

  const fmtRM = n => 'RM ' + n.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2});

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quotation ${escHtml(state.refNo)} — DNF Cable Sdn Bhd</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,sans-serif;font-size:10pt;background:#D6DBE3;color:#1A1A1A;}
  .toolbar{position:sticky;top:0;z-index:99;background:#30343A;display:flex;align-items:center;gap:8px;padding:8px 16px;box-shadow:0 2px 6px rgba(0,0,0,.4);}
  .tb-title{color:#BCC5CE;font-size:10.5pt;font-weight:bold;flex:1;}
  .btn{padding:6px 14px;border:none;border-radius:3px;font-size:8pt;font-weight:bold;cursor:pointer;color:white;transition:opacity .15s;}
  .btn:hover{opacity:.82;}
  .btn-green{background:#2E7D32;}
  .page-wrap{padding:20px;display:flex;justify-content:center;}
  .quotation{background:white;width:210mm;box-shadow:0 3px 16px rgba(0,0,0,.28);}
  .hdr-top{background:#30343A;padding:14px 18px 0;display:flex;justify-content:space-between;align-items:flex-start;}
  .co-name{font-size:19pt;font-weight:bold;letter-spacing:2px;color:#fff;}
  .co-sub{font-size:9pt;color:#BCC5CE;letter-spacing:1px;margin-top:2px;}
  .co-right{text-align:right;font-size:7pt;color:#8899A6;line-height:1.7;}
  .hdr-tag{background:#4B535C;color:#BCC5CE;font-size:8pt;padding:4px 18px;letter-spacing:.5px;}
  .hdr-meta{background:#30343A;color:#7A8B96;font-size:7pt;padding:5px 18px 10px;line-height:1.75;}
  .q-title{background:#30343A;border-top:1px solid #4B535C;color:#fff;font-size:15pt;font-weight:bold;letter-spacing:5px;padding:7px 18px;}
  .cust-wrap{padding:8px 18px 6px;}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px;}
  .info-row{display:flex;align-items:stretch;border-bottom:1px solid #C7CDD4;min-height:25px;}
  .il{background:#D9DEE4;font-size:7.5pt;font-weight:bold;color:#444;padding:3px 7px;min-width:108px;display:flex;align-items:center;white-space:nowrap;}
  .iv{background:#F5F5F5;flex:1;display:flex;align-items:center;padding:2px 6px;font-size:8pt;}
  .iv.y{background:#FFFF00;}
  .items-wrap{padding:4px 18px 0;}
  table.itbl{width:100%;border-collapse:collapse;font-size:7.5pt;}
  table.itbl th{background:#30343A;color:white;padding:5px 3px;text-align:center;border:1px solid #4B535C;font-size:7pt;white-space:nowrap;}
  .totals-wrap{padding:6px 18px 0;display:flex;justify-content:flex-end;}
  table.ttbl{border-collapse:collapse;font-size:8.5pt;min-width:280px;}
  .tl{padding:3px 10px;font-weight:bold;text-align:right;color:#444;white-space:nowrap;}
  .tv{padding:3px 10px;text-align:right;font-weight:bold;min-width:120px;}
  .tv.grand{font-size:11pt;border-top:2px solid #30343A;color:#30343A;}
  .tnc-wrap{padding:8px 18px 0;}
  table.tnctbl{width:100%;border-collapse:collapse;font-size:6.5pt;}
  .tnc-n{background:#30343A;color:white;text-align:center;padding:3px 5px;width:18px;font-weight:bold;border:1px solid #4B535C;}
  .tnc-h{background:#4B535C;color:#BCC5CE;padding:3px 7px;font-weight:bold;border:1px solid #4B535C;white-space:nowrap;}
  .tnc-v{background:#F3F5F7;padding:3px 7px;border:1px solid #C7CDD4;line-height:1.5;color:#333;}
  .sig-wrap{padding:10px 18px 0;display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .sig-box{border-top:1px solid #30343A;padding-top:4px;font-size:7pt;color:#444;min-height:40px;}
  .footer{background:#30343A;color:#7A8B96;font-size:6.5pt;padding:8px 18px;text-align:center;margin-top:10px;line-height:1.7;}
  .add-row-wrap{padding:4px 18px 6px;display:flex;gap:8px;align-items:center;}
  @media print{
    .toolbar,.no-print{display:none!important;}
    body{background:white;}
    .page-wrap{padding:0;}
    .quotation{box-shadow:none;width:100%;}
  }
</style>
</head>
<body>
<div class="toolbar no-print">
  <span class="tb-title">DNF Cable Sdn Bhd — Quotation</span>
  <button class="btn btn-green" onclick="window.print()">&#128438; Print / Save PDF</button>
</div>
<div class="page-wrap">
<div class="quotation">

  <!-- Header -->
  <div class="hdr-top">
    <div>
      <div class="co-name">DNF</div>
      <div class="co-sub">CABLE SDN BHD</div>
    </div>
    <div class="co-right">
      No. 6, Jalan Manis 5, Taman Segar,<br>
      56100 Cheras, Kuala Lumpur, Malaysia.<br>
      Tel : +603-9200 9888<br>
      Email : sales@dnfcable.com.my<br>
      SST Reg. No. : B16-1808-32001462
    </div>
  </div>
  <div class="hdr-tag">www.dnfcable.com.my</div>
  <div class="hdr-meta">
    Cable Manufacturer &amp; Supplier &nbsp;·&nbsp; Est. 1982 &nbsp;·&nbsp; MS / IEC Certified
  </div>
  <div class="q-title">QUOTATION</div>

  <!-- Customer Info -->
  <div class="cust-wrap">
    <div class="info-grid">
      <div>
        <div class="info-row">
          <div class="il">Company Name :</div>
          <div class="iv">${escHtml(cust.company || '')}</div>
        </div>
        <div class="info-row">
          <div class="il">Attention :</div>
          <div class="iv y">${escHtml(cust.attn || '')}</div>
        </div>
        <div class="info-row">
          <div class="il">Contact No. :</div>
          <div class="iv y">${escHtml(cust.tel || '')}</div>
        </div>
        <div class="info-row">
          <div class="il">Email :</div>
          <div class="iv y">${escHtml(cust.email || '')}</div>
        </div>
        <div class="info-row">
          <div class="il">Subject :</div>
          <div class="iv">Quotation for the supply of DNF Cable.</div>
        </div>
      </div>
      <div>
        <div class="info-row">
          <div class="il">Quotation No. :</div>
          <div class="iv y">${escHtml(state.refNo)}</div>
        </div>
        <div class="info-row">
          <div class="il">Date :</div>
          <div class="iv">${escHtml(dateFormatted)}</div>
        </div>
        <div class="info-row">
          <div class="il">Validity :</div>
          <div class="iv">Standard Validity</div>
        </div>
        <div class="info-row">
          <div class="il">Sales Person :</div>
          <div class="iv">${salesman}</div>
        </div>
        <div class="info-row">
          <div class="il">Customer Ref :</div>
          <div class="iv y"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Items Table -->
  <div class="items-wrap">
    <table class="itbl">
      <thead>
        <tr>
          <th style="width:24px;">No.</th>
          <th>Description</th>
          <th style="width:50px;">UOM</th>
          <th style="width:55px;">Qty</th>
          <th style="width:75px;">Unit Price (RM)</th>
          <th style="width:90px;">Amount (RM)</th>
        </tr>
      </thead>
      <tbody>
        ${itemRowsHtml}
        ${drumRowHtml}
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div class="totals-wrap" style="padding-top:8px;">
    <table class="ttbl">
      <tr>
        <td class="tl">Subtotal (Before SST) :</td>
        <td class="tv">${fmtRM(sub + drumAmt)}</td>
      </tr>
      <tr>
        <td class="tl">${sstPct > 0 ? `SST Amount (${sstPct}%) :` : 'SST Amount :'}</td>
        <td class="tv">${fmtRM(sst)}</td>
      </tr>
      <tr>
        <td class="tl" style="font-size:11pt;font-weight:bold;">TOTAL :</td>
        <td class="tv grand">${fmtRM(total)}</td>
      </tr>
    </table>
  </div>

  <!-- Terms & Conditions -->
  <div class="tnc-wrap" style="padding-top:12px;">
    <table class="tnctbl">
      <tr>
        <td class="tnc-n">1</td>
        <td class="tnc-h">Quotation Validity</td>
        <td class="tnc-v">Prices quoted are applicable for the packaged offer only. In the event of any discrepancy between this quotation and the Customer&#8217;s Purchase Order (PO), the terms and conditions stated in this quotation shall prevail unless otherwise mutually agreed in writing. Ex-stock items are subject to availability on a first-come, first-served basis.</td>
      </tr>
      <tr>
        <td class="tnc-n">2</td>
        <td class="tnc-h">Price Validity</td>
        <td class="tnc-v">This quotation shall remain valid until 5:00 PM on the above-mentioned date. Notwithstanding the validity period stated herein, prices are subject to adjustment should the London Metal Exchange (LME) copper price exceed USD 13,850 per metric ton (MT) during the quotation validity period.</td>
      </tr>
      <tr>
        <td class="tnc-n">3</td>
        <td class="tnc-h">Payment Terms</td>
        <td class="tnc-v">Payment shall be made in full and cleared prior to delivery. All banking and related charges shall be borne solely by the Customer. A draft copy of the Letter of Credit (LC) shall be submitted to us for review and comments prior to issuance through the bank, subject to mutual agreement by both parties. Any overdue outstanding amounts must be fully settled before commencement of any subsequent deliveries.</td>
      </tr>
      <tr>
        <td class="tnc-n">4</td>
        <td class="tnc-h">Late Payment</td>
        <td class="tnc-v">Interest at the rate of 1.5% per month shall be charged on all overdue outstanding amounts until full settlement is received.</td>
      </tr>
      <tr>
        <td class="tnc-n">5</td>
        <td class="tnc-h">SST</td>
        <td class="tnc-v">All prices quoted are subject to 10% Sales and Service Tax (SST), where applicable, and shall be treated as included or excluded based on the quotation summary stated herein.</td>
      </tr>
      <tr>
        <td class="tnc-n">6</td>
        <td class="tnc-h">Delivery</td>
        <td class="tnc-v">Upon receipt of Customer&#8217;s Purchase Order (PO), ex-stock items shall be subject to immediate allocation, while non-stock items shall commence within 2&#8211;4 working weeks or in accordance with mutually agreed delivery schedules, subject to breakdown lengths and all necessary approvals where applicable. Delivery of ex-stock items shall be completed within one (1) month from receipt of Customer&#8217;s PO.</td>
      </tr>
    </table>
  </div>

  <!-- Signature -->
  <div class="sig-wrap" style="padding-bottom:10px;">
    <div class="sig-box">
      <div style="font-weight:bold;margin-bottom:30px;">Prepared by :</div>
      <div>${salesman}</div>
      <div style="color:#888;">DNF Cable Sdn Bhd</div>
    </div>
    <div class="sig-box">
      <div style="font-weight:bold;margin-bottom:30px;">Accepted by :</div>
      <div>${escHtml(cust.attn || '')}</div>
      <div style="color:#888;">${escHtml(cust.company || '')}</div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    DNF Cable Sdn Bhd &nbsp;·&nbsp; No. 6, Jalan Manis 5, Taman Segar, 56100 Cheras, Kuala Lumpur &nbsp;·&nbsp; Tel: +603-9200 9888 &nbsp;·&nbsp; sales@dnfcable.com.my
  </div>

</div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `DNF-Quotation-${state.refNo}.html`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Quotation file downloaded ✓');
}

// ─── Item Modal ───────────────────────────────────────────────────────────
function openItemModal(editIdx) {
  state.editIdx = editIdx;
  const existing = editIdx >= 0 ? state.items[editIdx] : null;
  const settings = DB.settings();
  const customCables = DB.customCables();

  let selectedGroup = existing?.group || 'CU';
  let selectedCat   = existing?.category || '';
  let selectedSize  = existing?.size || '';
  let selectedTier  = existing?.tier || '+0';
  let isCustom      = existing?.isCustom || false;

  function rebuildModal() {
    const cats = isCustom
      ? customCables.map((c,i) => `<option value="[Custom:${i}]" ${existing?.customIdx===i?'selected':''}>${c.name}</option>`).join('')
      : (CABLE_GROUPS[selectedGroup]?.keys||[]).map(k => `<option value="${k}" ${k===selectedCat?'selected':''}>${k}</option>`).join('');

    const sizes = !isCustom && selectedCat ? sizesFor(selectedCat).map(s => `<option value="${s}" ${s===selectedSize?'selected':''}>${s}</option>`).join('') : '';
    const tiers = !isCustom && selectedCat ? tiersFor(selectedCat).map(t => `<option value="${t}" ${t===selectedTier?'selected':''}>${t}</option>`).join('') : '';
    const storedPrice = !isCustom && selectedCat && selectedSize && selectedTier ? (lookupPrice(selectedCat, selectedSize, selectedTier)||'') : '';
    const curPrice = existing?.price || storedPrice || '';
    const curMarkup = existing?.markup || '0';
    const sellPrice = curPrice ? calcSell(+curPrice, +curMarkup) : null;

    return `
      <div class="sheet-body">
        <!-- Group selector -->
        <div class="form-group">
          <label class="form-label">Price List</label>
          <div class="pill-group" id="group-pills">
            ${['CU','ALU','FR'].map(g => `<span class="pill ${!isCustom&&selectedGroup===g?'active':''}" data-group="${g}">${CABLE_GROUPS[g].label}</span>`).join('')}
            <span class="pill ${isCustom?'active':''}" data-group="CUSTOM">Custom</span>
          </div>
        </div>

        <!-- Cable type -->
        <div class="form-group">
          <label class="form-label">${isCustom ? 'Custom Cable' : 'Cable Type'}</label>
          <select class="form-control" id="sel-cat">
            <option value="">— Select —</option>
            ${cats}
          </select>
        </div>

        ${!isCustom ? `
        <!-- Size -->
        <div class="form-group" id="size-group" ${!selectedCat?'style="display:none"':''}>
          <label class="form-label">Size</label>
          <select class="form-control" id="sel-size">
            <option value="">— Select size —</option>
            ${sizes}
          </select>
        </div>

        <!-- Colour -->
        <div class="form-group">
          <label class="form-label">Colour (optional)</label>
          <select class="form-control" id="sel-colour">
            ${COLOURS.map(c=>`<option value="${c}" ${c===(existing?.colour||'')?'selected':''}>${c||'— None —'}</option>`).join('')}
          </select>
        </div>

        <!-- Price tier -->
        <div class="form-group" id="tier-group" ${!selectedCat?'style="display:none"':''}>
          <label class="form-label">Price Tier</label>
          <select class="form-control" id="sel-tier">
            ${tiers}
          </select>
        </div>
        ` : ''}

        <!-- Price display -->
        <div class="price-display" id="price-display">
          <div>
            <div class="price-calc-label">Selling Price</div>
            <div class="price-calc-sub" id="price-calc-sub">${storedPrice ? 'Base: RM '+Number(storedPrice).toFixed(4) : 'Enter price below'}</div>
          </div>
          <div class="price-calc-value" id="price-calc-value">${sellPrice ? 'RM '+sellPrice.toFixed(4) : '—'}</div>
        </div>

        <!-- Base price + markup -->
        <div class="row-2col">
          <div class="form-group">
            <label class="form-label">Base Price (RM)</label>
            <input class="form-control" id="inp-base-price" type="number" step="0.0001" placeholder="0.0000" value="${curPrice}">
          </div>
          <div class="form-group">
            <label class="form-label">Markup %</label>
            <input class="form-control" id="inp-markup" type="number" step="0.1" placeholder="0" value="${curMarkup}">
          </div>
        </div>
        <div class="tier-hint" id="price-hint">Sell = base ÷ (1 − markup%)</div>

        <!-- Override -->
        <div class="form-group">
          <label class="form-label">Override Price (leave blank = use calculated)</label>
          <input class="form-control" id="inp-override" type="number" step="0.0001" placeholder="Optional manual price" value="${existing?.override||''}">
        </div>

        <!-- Qty + Unit -->
        <div class="row-2col">
          <div class="form-group">
            <label class="form-label">Quantity</label>
            <input class="form-control" id="inp-qty" type="number" step="1" placeholder="1" value="${existing?.qty||''}">
          </div>
          <div class="form-group">
            <label class="form-label">Unit</label>
            <select class="form-control" id="sel-unit">
              ${UNITS.map(u=>`<option value="${u}" ${u===(existing?.unit||'Meter')?'selected':''}>${u}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Remarks -->
        <div class="form-group">
          <label class="form-label">Remarks (optional)</label>
          <input class="form-control" id="inp-remarks" placeholder="e.g. Black colour, special length..." value="${existing?.remarks||''}">
        </div>

        <!-- Stock + Drum -->
        <div class="row-2col">
          <div class="form-group">
            <label class="form-label">Stock Status</label>
            <select class="form-control" id="sel-stock">
              <option value="exstock"           ${(existing?.stock||'exstock')==='exstock'?'selected':''}>✅ Exstock</option>
              <option value="no stock"          ${existing?.stock==='no stock'?'selected':''}>❌ No Stock</option>
              <option value="no need to check"  ${existing?.stock==='no need to check'?'selected':''}>— Skip</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Drum Charges</label>
            <label class="check-row">
              <input type="checkbox" id="chk-drum" ${existing?.drum?'checked':''}> Include RM150 drum charge
            </label>
          </div>
        </div>

        <!-- WA desc -->
        <div class="form-group">
          <label class="form-label">WhatsApp Description (auto-fill or edit)</label>
          <input class="form-control" id="inp-wa-desc" placeholder="Auto-generated..." value="${existing?.waDesc||''}">
        </div>

      </div>
      <div class="sheet-footer">
        <button class="btn btn-ghost" id="btn-item-cancel">Cancel</button>
        <button class="btn btn-primary btn-full" id="btn-item-save">${editIdx>=0?'Update Item':'Add Item'}</button>
      </div>
    `;
  }

  openModal(rebuildModal(), { title: editIdx >= 0 ? 'Edit Item' : 'Add Cable Item' });

  function attachEvents() {
    // Group pills
    $('modal-content').querySelectorAll('[data-group]').forEach(p => {
      p.addEventListener('click', () => {
        const g = p.dataset.group;
        isCustom = (g === 'CUSTOM');
        if (!isCustom) selectedGroup = g;
        selectedCat = ''; selectedSize = '';
        // Re-render the full modal inner content
        $('modal-content').innerHTML = `
          <div class="sheet-header">
            <span class="sheet-title">${editIdx >= 0 ? 'Edit Item' : 'Add Cable Item'}</span>
            <button class="btn-icon dark" id="btn-close-modal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          ${rebuildModal()}
        `;
        $('btn-close-modal').onclick = closeModal;
        $('modal-overlay').onclick = closeModal;
        attachEvents();
        updatePriceDisplay();
      });
    });

    // Re-attach after a clean rebuild (simple approach: rebuild the inner div)
    $('sel-cat')?.addEventListener('change', e => {
      const v = e.target.value;
      if (isCustom) {
        selectedCat = v;
      } else {
        selectedCat = v;
        selectedSize = '';
        const sizes = v ? sizesFor(v).map(s=>`<option value="${s}">${s}</option>`).join('') : '';
        const tierOpts = v ? tiersFor(v).map(t=>`<option value="${t}" ${t==='+0'?'selected':''}>${t}</option>`).join('') : '';
        const sg = $('size-group'); if(sg) sg.style.display = v ? '' : 'none';
        const tg = $('tier-group'); if(tg) tg.style.display = v ? '' : 'none';
        const ss = $('sel-size');   if(ss) ss.innerHTML = '<option value="">— Select size —</option>' + sizes;
        const st = $('sel-tier');   if(st) st.innerHTML = tierOpts;
        selectedTier = '+0';
        updatePriceDisplay();
      }
    });

    $('sel-size')?.addEventListener('change', e => {
      selectedSize = e.target.value;
      updatePriceDisplay();
    });
    $('sel-tier')?.addEventListener('change', e => {
      selectedTier = e.target.value;
      updatePriceDisplay();
    });
    $('inp-base-price')?.addEventListener('input', updatePriceDisplay);
    $('inp-markup')?.addEventListener('input', updatePriceDisplay);
    $('inp-override')?.addEventListener('input', updatePriceDisplay);

    $('btn-item-cancel')?.addEventListener('click', closeModal);
    $('btn-item-save')?.addEventListener('click', saveItem);
  }

  function updatePriceDisplay() {
    const stored = !isCustom && selectedCat && selectedSize && selectedTier
      ? lookupPrice(selectedCat, selectedSize, selectedTier) : null;
    const inpBase = $('inp-base-price');
    const inpMarkup = $('inp-markup');
    const inpOverride = $('inp-override');
    if (!inpBase) return;

    const base  = stored || (+inpBase.value || null);
    const markup = +inpMarkup.value || 0;
    const override = inpOverride?.value ? +inpOverride.value : null;
    const sell = override || (base ? calcSell(base, markup) : null);

    const sub = $('price-calc-sub');
    const val = $('price-calc-value');
    if (sub) sub.textContent = stored ? `List: RM ${Number(stored).toFixed(4)} | Markup: ${markup}%` : (base ? `Base: RM ${Number(base).toFixed(4)} | Markup: ${markup}%` : 'Enter price below');
    if (val) val.textContent = sell ? 'RM ' + sell.toFixed(4) : '—';
    if (stored && inpBase.value === '') inpBase.value = stored;
  }

  function saveItem() {
    const cat    = $('sel-cat')?.value || '';
    const size   = $('sel-size')?.value || '';
    const colour = $('sel-colour')?.value || '';
    const tier   = $('sel-tier')?.value || '';
    const base   = +$('inp-base-price')?.value || 0;
    const markup = +$('inp-markup')?.value || 0;
    const overrideRaw = $('inp-override')?.value;
    const override    = overrideRaw ? +overrideRaw : null;
    const qty    = +$('inp-qty')?.value || 1;
    const unit   = $('sel-unit')?.value || 'Meter';
    const remarks= $('inp-remarks')?.value?.trim() || '';
    const stock  = $('sel-stock')?.value || 'exstock';
    const drum   = $('chk-drum')?.checked || false;
    const waDesc = $('inp-wa-desc')?.value?.trim() || '';

    if (!isCustom && !cat) { toast('Select a cable type'); return; }
    if (!isCustom && !size) { toast('Select a size'); return; }
    if (!base && !override) { toast('Enter a price'); return; }
    if (!qty || qty <= 0)   { toast('Enter a valid quantity'); return; }

    const sell = override || calcSell(base, markup) || 0;

    let item = {
      isCustom,
      category: isCustom ? '' : cat,
      group:    selectedGroup,
      size:     isCustom ? '' : size,
      colour,
      tier,
      basePrice: base,
      markup,
      override: override || null,
      price: sell,
      qty,
      unit,
      remarks,
      stock,
      drum,
      waDesc: waDesc || (isCustom ? '' : buildWaDesc({ category: cat, size, colour })),
    };

    if (isCustom) {
      const cidx = cat.replace('[Custom:','').replace(']','');
      const cc   = DB.customCables()[+cidx];
      item.customName = cc?.name || '';
      item.customIdx  = +cidx;
      item.price      = override || cc?.price || sell;
      item.waDesc     = waDesc || cc?.waDesc || cc?.name || '';
    }

    if (state.editIdx >= 0) {
      state.items[state.editIdx] = item;
    } else {
      state.items.push(item);
    }
    closeModal();
    renderQuoteTab();
    toast(state.editIdx >= 0 ? 'Item updated ✓' : 'Item added ✓');
  }

  attachEvents();
  updatePriceDisplay();
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: CUSTOMERS
// ═══════════════════════════════════════════════════════════════════════════
function renderCustomersTab() {
  $('page-title').textContent = 'Customers';
  $('btn-back').classList.add('hidden');
  updatePriceBadge();

  const hdr = $('header-actions');
  hdr.innerHTML = `<button class="btn-icon" id="btn-add-cust" title="Add customer">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  </button>`;

  const main = $('main');
  main.innerHTML = '';

  const page = el('div','customers-page');

  const searchBar = el('div','search-bar');
  searchBar.innerHTML = `
    <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input class="search-input" id="cust-search" placeholder="Search customers..." type="search">
    <span id="cust-count" class="text-sm text-muted"></span>
  `;
  page.appendChild(searchBar);

  const list = el('div','cust-list');
  page.appendChild(list);

  main.appendChild(page);

  const hideFab = document.querySelector('.fab');
  if (hideFab) hideFab.classList.add('hidden');

  function renderList(q='') {
    list.innerHTML = '';
    const customers = DB.customers();
    const filtered = q ? customers.filter(c => (c.company+c.attn+c.tel+c.email).toLowerCase().includes(q.toLowerCase())) : customers;
    $('cust-count').textContent = `${filtered.length} customer${filtered.length!==1?'s':''}`;
    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-msg">${q ? 'No results found.' : 'No customers yet.\nTap + to add one.'}</div></div>`;
      return;
    }
    filtered.forEach((c, displayIdx) => {
      const realIdx = customers.indexOf(c);
      const row = el('div','cust-item');
      row.innerHTML = `
        <div class="cust-avatar">${initials(c.company)}</div>
        <div class="cust-item-info">
          <div class="cust-company">${c.company}</div>
          <div class="cust-detail">${[c.attn, c.tel, c.email].filter(Boolean).join(' · ')}</div>
        </div>
        <div class="cust-actions">
          ${c.tel ? `<button class="btn-icon dark" title="WhatsApp" data-action="wa" data-idx="${realIdx}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>` : ''}
          <button class="btn-icon dark" title="Edit" data-action="edit" data-idx="${realIdx}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      `;
      // Tap row = load into quote
      row.addEventListener('click', e => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (action === 'wa') {
          openWaForCustomer(realIdx);
        } else if (action === 'edit') {
          openCustomerForm(realIdx);
        } else {
          // Load into quote
          state.customer = { ...customers[realIdx] };
          state.tab = 'quote';
          setTab('quote');
          toast(`${customers[realIdx].company} loaded into quote`);
        }
      });
      list.appendChild(row);
    });
  }

  $('cust-search').addEventListener('input', e => renderList(e.target.value));
  $('btn-add-cust').addEventListener('click', () => openCustomerForm(-1, () => renderList($('cust-search')?.value||'')));
  renderList();
}

function openWaForCustomer(idx) {
  const c = DB.customers()[idx];
  if (!c?.tel) { toast('No phone number saved'); return; }
  const msg = state.items.length > 0 ? buildWaMessage() : '';
  if (!msg) {
    window.open(`https://wa.me/${fmtPhone(c.tel)}`, '_blank');
    return;
  }
  const url = `https://wa.me/${fmtPhone(c.tel)}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function openCustomerForm(idx, onSaved) {
  const customers = DB.customers();
  const c = idx >= 0 ? customers[idx] : null;

  openModal(`
    <div class="sheet-body">
      <div class="form-group">
        <label class="form-label">Company Name *</label>
        <input class="form-control" id="cf-company" placeholder="Company name" value="${escHtml(c?.company||'')}">
      </div>
      <div class="form-group">
        <label class="form-label">Contact Person</label>
        <input class="form-control" id="cf-attn" placeholder="Attention / Contact" value="${escHtml(c?.attn||'')}">
      </div>
      <div class="row-2col">
        <div class="form-group">
          <label class="form-label">Phone *</label>
          <input class="form-control" id="cf-tel" type="tel" placeholder="01x-xxxxxxx" value="${escHtml(c?.tel||'')}">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-control" id="cf-email" type="email" placeholder="email@..." value="${escHtml(c?.email||'')}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Address</label>
        <input class="form-control" id="cf-address" placeholder="Street address" value="${escHtml(c?.address||'')}">
      </div>
      <div class="row-2col">
        <div class="form-group">
          <label class="form-label">City</label>
          <input class="form-control" id="cf-city" placeholder="City" value="${escHtml(c?.city||'')}">
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <input class="form-control" id="cf-notes" placeholder="Notes..." value="${escHtml(c?.notes||'')}">
        </div>
      </div>
    </div>
    <div class="sheet-footer">
      ${idx >= 0 ? `<button class="btn btn-red" id="btn-del-cust">🗑 Delete</button>` : ''}
      <button class="btn btn-ghost" id="btn-cust-cancel">Cancel</button>
      <button class="btn btn-primary btn-full" id="btn-cust-save">${idx >= 0 ? 'Update' : 'Save Customer'}</button>
    </div>
  `, { title: idx >= 0 ? 'Edit Customer' : 'New Customer' });

  $('btn-cust-cancel').addEventListener('click', closeModal);

  $('btn-del-cust')?.addEventListener('click', () => {
    if (confirm(`Delete "${c.company}"?`)) {
      const list = DB.customers();
      list.splice(idx, 1);
      DB.saveCustomers(list);
      closeModal();
      onSaved && onSaved();
      toast('Customer deleted');
    }
  });

  $('btn-cust-save').addEventListener('click', () => {
    const company = $('cf-company').value.trim();
    const tel     = $('cf-tel').value.trim();
    if (!company) { toast('Company name required'); return; }
    if (!tel)     { toast('Phone number required'); return; }
    const entry = {
      company,
      attn:    $('cf-attn').value.trim(),
      tel,
      email:   $('cf-email').value.trim(),
      address: $('cf-address').value.trim(),
      city:    $('cf-city').value.trim(),
      notes:   $('cf-notes').value.trim(),
    };
    const list = DB.customers();
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    DB.saveCustomers(list);
    closeModal();
    onSaved && onSaved();
    toast(idx >= 0 ? 'Customer updated ✓' : 'Customer saved ✓');
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: HISTORY
// ═══════════════════════════════════════════════════════════════════════════
function renderHistoryTab() {
  $('page-title').textContent = 'History';
  $('btn-back').classList.add('hidden');
  updatePriceBadge();
  $('header-actions').innerHTML = `<button class="btn-icon" id="btn-clear-hist" title="Clear history">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  </button>`;

  const main = $('main');
  main.innerHTML = '';
  const hideFab = document.querySelector('.fab');
  if (hideFab) hideFab.classList.add('hidden');

  const hist = DB.history();
  if (hist.length === 0) {
    main.innerHTML = `<div class="empty-state" style="padding-top:80px"><div class="empty-icon">🕐</div><div class="empty-msg">No saved quotations yet.<br>Build a quote and tap Save.</div></div>`;
    return;
  }

  const page = el('div','history-page');
  hist.forEach((h, i) => {
    const card = el('div','hist-card');
    card.innerHTML = `
      <div class="hist-header">
        <span class="hist-ref">Ref: ${h.ref}</span>
        <span class="hist-date">${h.date}</span>
      </div>
      <div class="hist-body">
        <div class="hist-cust">${h.customer?.company || 'Walk-in'}</div>
        <div class="hist-summary">${h.items.length} item${h.items.length!==1?'s':''} · ${h.customer?.tel||''}</div>
        <div class="hist-total">${fmt(h.total)}</div>
      </div>
      <div class="hist-footer">
        <button class="btn btn-sm btn-primary" data-action="load" data-idx="${i}">📄 Load</button>
        <button class="btn btn-sm btn-wa" data-action="wa" data-idx="${i}">💬 WA</button>
        <button class="btn btn-sm btn-ghost" data-action="del" data-idx="${i}">🗑</button>
      </div>
    `;
    page.appendChild(card);
  });
  main.appendChild(page);

  page.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const idx    = +btn.dataset.idx;
    const h      = DB.history()[idx];

    if (action === 'load') {
      state.items    = JSON.parse(JSON.stringify(h.items));
      state.customer = h.customer ? { ...h.customer } : null;
      state.refNo    = h.ref;
      state.quoteDate= h.date;
      setTab('quote');
      toast('Quotation loaded ✓');
    } else if (action === 'wa') {
      // Temporarily swap items to build WA message for this history entry
      const saved = { items: state.items, customer: state.customer };
      state.items    = h.items;
      state.customer = h.customer;
      const msg = buildWaMessage();
      state.items    = saved.items;
      state.customer = saved.customer;
      const phone = h.customer?.tel || '';
      const url = phone ? `https://wa.me/${fmtPhone(phone)}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    } else if (action === 'del') {
      if (confirm('Delete this saved quotation?')) {
        const list = DB.history();
        list.splice(idx, 1);
        DB.saveHistory(list);
        renderHistoryTab();
        toast('Deleted');
      }
    }
  });

  $('btn-clear-hist').addEventListener('click', () => {
    if (confirm('Clear all history?')) {
      DB.saveHistory([]);
      renderHistoryTab();
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function renderSettingsTab() {
  $('page-title').textContent = 'Settings';
  $('btn-back').classList.add('hidden');
  $('header-actions').innerHTML = '';
  updatePriceBadge();
  const hideFab = document.querySelector('.fab');
  if (hideFab) hideFab.classList.add('hidden');

  const settings = DB.settings();
  const main = $('main');
  main.innerHTML = '';
  const page = el('div','settings-page');

  // ── Salesman profile ──
  const s1 = el('div');
  s1.innerHTML = '<div class="setting-section-title">Profile</div>';
  const c1 = el('div','setting-card');
  c1.innerHTML = `
    <div class="setting-row">
      <div><div class="setting-row-label">Salesman Name</div><div class="setting-row-desc">Appears on quotations</div></div>
      <input class="form-control" id="inp-salesman" value="${escHtml(settings.salesman||'')}" style="width:150px;text-align:right">
    </div>
  `;
  s1.appendChild(c1);
  page.appendChild(s1);

  // ── Quote settings ──
  const s2 = el('div');
  s2.innerHTML = '<div class="setting-section-title">Quotation</div>';
  const c2 = el('div','setting-card');
  c2.innerHTML = `
    <div class="setting-row">
      <div><div class="setting-row-label">Include SST (10%)</div><div class="setting-row-desc">Add to quotation totals</div></div>
      <label class="toggle setting-row-right">
        <input type="checkbox" id="chk-sst" ${settings.sst !== false ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="setting-row">
      <div><div class="setting-row-label">Drum Price</div><div class="setting-row-desc">Per drum charge</div></div>
      <span style="font-weight:700">RM ${DRUM_PRICE.toFixed(2)}</span>
    </div>
  `;
  s2.appendChild(c2);
  page.appendChild(s2);

  // ── Price data ──
  const s3 = el('div');
  s3.innerHTML = '<div class="setting-section-title">Price Data</div>';
  const c3 = el('div','setting-card');
  const priceCount = Object.keys(DB.prices()).length;
  c3.innerHTML = `
    <div class="setting-row">
      <div>
        <div class="setting-row-label">Price Database</div>
        <div class="setting-row-desc">${priceCount > 0 ? `${priceCount} cable categories loaded` : 'No prices loaded — enter manually per item'}</div>
      </div>
      <button class="btn btn-sm btn-blue" id="btn-import-prices">📂 Import</button>
    </div>
    <div class="setting-row">
      <div>
        <div class="setting-row-label">Last Updated</div>
        <div class="setting-row-desc">${settings.priceDate || 'Never'}</div>
      </div>
      ${priceCount > 0 ? `<button class="btn btn-sm btn-red" id="btn-clear-prices">Clear</button>` : ''}
    </div>
  `;
  s3.appendChild(c3);
  page.appendChild(s3);

  // ── Custom cables ──
  const s4 = el('div');
  s4.innerHTML = '<div class="setting-section-title">Custom Cables</div>';
  const customCables = DB.customCables();
  const c4 = el('div','setting-card');
  let ccRows = customCables.map((cc,i) => `
    <div class="setting-row">
      <div><div class="setting-row-label">${escHtml(cc.name)}</div><div class="setting-row-desc">RM ${Number(cc.price).toFixed(4)} / ${cc.unit}</div></div>
      <div style="display:flex;gap:4px">
        <button class="btn btn-sm btn-blue" data-cc-edit="${i}">Edit</button>
        <button class="btn btn-sm btn-red"  data-cc-del="${i}">🗑</button>
      </div>
    </div>
  `).join('');
  c4.innerHTML = ccRows + `
    <div class="setting-row">
      <button class="btn btn-green btn-full" id="btn-add-custom">➕ Add Custom Cable</button>
    </div>
  `;
  s4.appendChild(c4);
  page.appendChild(s4);

  // ── Data management ──
  const s5 = el('div');
  s5.innerHTML = '<div class="setting-section-title">Data</div>';
  const c5 = el('div','setting-card');
  c5.innerHTML = `
    <div class="setting-row">
      <div><div class="setting-row-label">Export All Data</div><div class="setting-row-desc">Download customers, custom cables & history</div></div>
      <button class="btn btn-sm btn-blue" id="btn-export">⬇ Export</button>
    </div>
    <div class="setting-row">
      <div><div class="setting-row-label">Import Data</div><div class="setting-row-desc">Restore from exported JSON</div></div>
      <button class="btn btn-sm btn-amber" id="btn-import-data">⬆ Import</button>
    </div>
  `;
  s5.appendChild(c5);
  page.appendChild(s5);

  // About
  const about = el('div','about-section');
  about.innerHTML = `
    <b style="color:var(--primary)">DNF Cable Quotation</b><br>
    Mobile v1.0 · DNF Cable Sdn Bhd<br>
    <span style="font-size:11px">Tel: +603 9200 9888</span>
  `;
  page.appendChild(about);

  main.appendChild(page);

  // Events
  $('inp-salesman').addEventListener('change', e => {
    const s = DB.settings(); s.salesman = e.target.value.trim(); DB.saveSettings(s);
    toast('Saved ✓');
  });
  $('chk-sst').addEventListener('change', e => {
    const s = DB.settings(); s.sst = e.target.checked; DB.saveSettings(s);
    toast(e.target.checked ? 'SST enabled' : 'SST disabled');
  });

  $('btn-import-prices').addEventListener('click', showPriceImport);
  $('btn-clear-prices')?.addEventListener('click', () => {
    if (confirm('Clear all stored prices?')) { DB.savePrices({}); renderSettingsTab(); toast('Prices cleared'); }
  });

  $('btn-add-custom').addEventListener('click', () => openCustomCableForm(-1, renderSettingsTab));
  c4.querySelectorAll('[data-cc-edit]').forEach(b => b.addEventListener('click', () => openCustomCableForm(+b.dataset.ccEdit, renderSettingsTab)));
  c4.querySelectorAll('[data-cc-del]').forEach(b => b.addEventListener('click', () => {
    const cc = DB.customCables(); cc.splice(+b.dataset.ccDel, 1); DB.saveCustomCables(cc); renderSettingsTab(); toast('Deleted');
  }));

  $('btn-export').addEventListener('click', exportData);
  $('btn-import-data').addEventListener('click', importData);
}

function showPriceImport() {
  openModal(`
    <div class="sheet-body">
      <p style="color:var(--muted);font-size:13px;line-height:1.6">
        Import a <b>prices.json</b> file exported from the DNF Cable desktop app.<br>
        Or paste JSON data directly below.
      </p>
      <div class="form-group">
        <label class="form-label">Choose File</label>
        <input type="file" id="price-file-inp" accept=".json" class="form-control" style="padding:6px">
      </div>
      <div class="form-group">
        <label class="form-label">Or Paste JSON</label>
        <textarea class="form-control" id="price-json-inp" rows="6" placeholder='{"CU/PVC 1c":{"1.5mm²":{"+0":1.23,...},...}}'></textarea>
      </div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn-ghost" id="btn-price-cancel">Cancel</button>
      <button class="btn btn-primary btn-full" id="btn-price-load">Load Prices</button>
    </div>
  `, { title: '📂 Import Prices' });

  $('price-file-inp').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => $('price-json-inp').value = ev.target.result;
    r.readAsText(f);
  });
  $('btn-price-cancel').addEventListener('click', closeModal);
  $('btn-price-load').addEventListener('click', () => {
    try {
      const data = JSON.parse($('price-json-inp').value);
      DB.savePrices(data);
      const s = DB.settings();
      s.priceDate = today();
      DB.saveSettings(s);
      closeModal();
      renderSettingsTab();
      toast(`Prices imported: ${Object.keys(data).length} categories ✓`);
    } catch (e) {
      toast('Invalid JSON — check the format');
    }
  });
}

function openCustomCableForm(idx, onSaved) {
  const cc = idx >= 0 ? DB.customCables()[idx] : null;
  openModal(`
    <div class="sheet-body">
      <div class="form-group"><label class="form-label">Product Name *</label>
        <input class="form-control" id="cc-name" value="${escHtml(cc?.name||'')}"></div>
      <div class="form-group"><label class="form-label">Description</label>
        <input class="form-control" id="cc-desc" value="${escHtml(cc?.desc||'')}"></div>
      <div class="row-2col">
        <div class="form-group"><label class="form-label">Unit Price (RM) *</label>
          <input class="form-control" id="cc-price" type="number" step="0.0001" value="${cc?.price||''}"></div>
        <div class="form-group"><label class="form-label">Unit</label>
          <select class="form-control" id="cc-unit">${UNITS.map(u=>`<option ${u===(cc?.unit||'Meter')?'selected':''}>${u}</option>`).join('')}</select></div>
      </div>
      <div class="form-group"><label class="form-label">WA Description</label>
        <input class="form-control" id="cc-wa" value="${escHtml(cc?.waDesc||'')}"></div>
    </div>
    <div class="sheet-footer">
      <button class="btn btn-ghost" id="btn-cc-cancel">Cancel</button>
      <button class="btn btn-primary btn-full" id="btn-cc-save">${idx>=0?'Update':'Save Cable'}</button>
    </div>
  `, { title: idx >= 0 ? 'Edit Custom Cable' : 'New Custom Cable' });

  $('btn-cc-cancel').addEventListener('click', closeModal);
  $('btn-cc-save').addEventListener('click', () => {
    const name  = $('cc-name').value.trim();
    const price = +$('cc-price').value;
    if (!name)       { toast('Name required'); return; }
    if (!price || price <= 0) { toast('Enter a valid price'); return; }
    const entry = { name, desc: $('cc-desc').value.trim(), price, unit: $('cc-unit').value, waDesc: $('cc-wa').value.trim() };
    const list = DB.customCables();
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    DB.saveCustomCables(list);
    closeModal();
    onSaved && onSaved();
    toast(idx >= 0 ? 'Cable updated ✓' : 'Cable saved ✓');
  });
}

function exportData() {
  const data = {
    customers:    DB.customers(),
    customCables: DB.customCables(),
    history:      DB.history(),
    exportedAt:   new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `dnf_data_${today().replace(/\//g,'')}.json`;
  a.click(); URL.revokeObjectURL(url);
  toast('Data exported ✓');
}

function importData() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json';
  inp.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.customers)    DB.saveCustomers(d.customers);
        if (d.customCables) DB.saveCustomCables(d.customCables);
        if (d.history)      DB.saveHistory(d.history);
        renderSettingsTab();
        toast('Data imported ✓');
      } catch { toast('Invalid file'); }
    };
    r.readAsText(f);
  });
  inp.click();
}

// ─── Header price badge ────────────────────────────────────────────────────
function updatePriceBadge() {
  const s = DB.settings();
  const badge = $('price-badge');
  if (s.priceDate) {
    badge.textContent = s.priceDate;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROUTER / NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
const TABS = {
  quote:     renderQuoteTab,
  customers: renderCustomersTab,
  history:   renderHistoryTab,
  settings:  renderSettingsTab,
};

function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  TABS[tab]?.();
}

// ═══════════════════════════════════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════════════════════════════════
function boot() {
  // Bottom nav events
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.addEventListener('click', () => setTab(b.dataset.tab));
  });

  // SW registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Initial render
  state.refNo     = genRef();
  state.quoteDate = today();
  setTab('quote');
}

document.addEventListener('DOMContentLoaded', boot);
