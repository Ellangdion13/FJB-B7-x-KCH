/* ============================================================
   B7 × KALBE CONSUMER HEALTH — MARKETPLACE DASHBOARD
   script.js
   ============================================================ */

'use strict';

/* ── State ────────────────────────────────────────────────── */
const state = {
  darkMode:   false,
  activeTab:  'wts',
  modalTab:   'wts',
};

/* ── DOM refs (cached) ────────────────────────────────────── */
const DOM = {
  body:         document.body,
  modeToggle:   document.getElementById('modeToggle'),
  modeDay:      document.getElementById('modeDay'),
  modeNight:    document.getElementById('modeNight'),
  tabWTS:       document.getElementById('tabWTS'),
  tabWTB:       document.getElementById('tabWTB'),
  badgeWTS:     document.getElementById('badgeWTS'),
  badgeWTB:     document.getElementById('badgeWTB'),
  secWTS:       document.getElementById('secWTS'),
  secWTB:       document.getElementById('secWTB'),
  btnPostIklan: document.getElementById('btnPostIklan'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalClose:   document.getElementById('modalClose'),
  modalTabWTS:  document.getElementById('modalTabWTS'),
  modalTabWTB:  document.getElementById('modalTabWTB'),
  btnSubmit:    document.getElementById('btnSubmit'),
  toast:        document.getElementById('toast'),
  searchWTS:    document.getElementById('searchWTS'),
  searchWTB:    document.getElementById('searchWTB'),
  gridWTS:      document.getElementById('gridWTS'),
  gridWTB:      document.getElementById('gridWTB'),
};

/* ============================================================
   DARK / LIGHT MODE
============================================================ */
function toggleMode() {
  state.darkMode = !state.darkMode;
  DOM.body.classList.toggle('dark-mode', state.darkMode);
  DOM.body.classList.toggle('light-mode', !state.darkMode);

  DOM.modeDay.classList.toggle('active', !state.darkMode);
  DOM.modeNight.classList.toggle('active', state.darkMode);

  localStorage.setItem('b7_dark_mode', state.darkMode ? '1' : '0');
}

function initDarkMode() {
  const saved = localStorage.getItem('b7_dark_mode');
  if (saved === '1') {
    state.darkMode = true;
    DOM.body.classList.add('dark-mode');
    DOM.body.classList.remove('light-mode');
    DOM.modeDay.classList.remove('active');
    DOM.modeNight.classList.add('active');
  }
}

/* ============================================================
   TAB SWITCHING (WTS / WTB)
============================================================ */
function switchTab(tab) {
  state.activeTab = tab;

  const isWTS = tab === 'wts';

  /* Tab buttons */
  DOM.tabWTS.className = isWTS ? 'tab-btn active-wts' : 'tab-btn';
  DOM.tabWTB.className = isWTS ? 'tab-btn' : 'tab-btn active-wtb';

  DOM.tabWTS.setAttribute('aria-selected', isWTS ? 'true' : 'false');
  DOM.tabWTB.setAttribute('aria-selected', isWTS ? 'false' : 'true');

  /* Badges */
  DOM.badgeWTS.className = isWTS ? 'tab-badge' : 'tab-badge inactive';
  DOM.badgeWTB.className = isWTS ? 'tab-badge inactive-blue' : 'tab-badge';

  /* Sections */
  DOM.secWTS.classList.toggle('visible', isWTS);
  DOM.secWTB.classList.toggle('visible', !isWTS);

  /* Clear search on tab switch */
  if (isWTS && DOM.searchWTB) DOM.searchWTB.value = '';
  if (!isWTS && DOM.searchWTS) DOM.searchWTS.value = '';
}

/* ============================================================
   FILTER CHIPS
============================================================ */
function setFilter(el, tab) {
  const bar = el.closest('.filter-bar');
  if (!bar) return;

  bar.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.remove('active', 'active-blue');
  });

  el.classList.add(tab === 'wts' ? 'active' : 'active-blue');
}

/* ============================================================
   CATEGORY SIDEBAR
============================================================ */
function selectCategory(el) {
  const list = el.closest('.cat-list');
  if (!list) return;

  list.querySelectorAll('.cat-item').forEach(item => item.classList.remove('selected'));
  el.classList.add('selected');
}

/* ============================================================
   SEARCH / FILTER CARDS
============================================================ */
function setupSearch() {
  if (DOM.searchWTS) {
    DOM.searchWTS.addEventListener('input', () => {
      filterCards(DOM.gridWTS, DOM.searchWTS.value);
    });
  }

  if (DOM.searchWTB) {
    DOM.searchWTB.addEventListener('input', () => {
      filterCards(DOM.gridWTB, DOM.searchWTB.value);
    });
  }
}

function filterCards(grid, query) {
  if (!grid) return;
  const q = query.trim().toLowerCase();

  grid.querySelectorAll('.product-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
}

/* ============================================================
   CONTACT / TAWAR ACTION
============================================================ */
function handleContact(vendorName, type) {
  const actionLabel = type === 'WTB' ? 'penawaran' : 'pesan';
  showToast(`✓ ${actionLabel} dikirim ke ${vendorName}`, 'success');
}

/* ============================================================
   MODAL — POST IKLAN
============================================================ */
function openModal() {
  DOM.modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  /* Focus first input */
  setTimeout(() => {
    const first = DOM.modalOverlay.querySelector('input, select, textarea');
    if (first) first.focus();
  }, 80);
}

function closeModal() {
  DOM.modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
  resetModalForm();
}

function switchModalTab(tab) {
  state.modalTab = tab;
  const isWTS = tab === 'wts';

  DOM.modalTabWTS.className = isWTS ? 'modal-tab active' : 'modal-tab';
  DOM.modalTabWTB.className = isWTS ? 'modal-tab' : 'modal-tab active-wtb';

  /* Adjust submit button label */
  DOM.btnSubmit.innerHTML = isWTS
    ? '<i class="ti ti-send" aria-hidden="true"></i> Publikasikan WTS'
    : '<i class="ti ti-send" aria-hidden="true"></i> Publikasikan WTB';
}

function resetModalForm() {
  ['postJudul', 'postKategori', 'postHarga', 'postDeskripsi', 'postPerusahaan', 'postKontak'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  switchModalTab('wts');
}

function submitPost() {
  const judul      = document.getElementById('postJudul')?.value.trim();
  const kategori   = document.getElementById('postKategori')?.value;
  const harga      = document.getElementById('postHarga')?.value.trim();
  const deskripsi  = document.getElementById('postDeskripsi')?.value.trim();
  const perusahaan = document.getElementById('postPerusahaan')?.value.trim();
  const kontak     = document.getElementById('postKontak')?.value.trim();

  /* Validation */
  if (!judul) {
    showToast('Judul iklan wajib diisi.', 'error');
    document.getElementById('postJudul')?.focus();
    return;
  }
  if (!kategori) {
    showToast('Pilih kategori terlebih dahulu.', 'error');
    document.getElementById('postKategori')?.focus();
    return;
  }
  if (!perusahaan) {
    showToast('Nama perusahaan wajib diisi.', 'error');
    document.getElementById('postPerusahaan')?.focus();
    return;
  }
  if (!kontak) {
    showToast('Kontak (WA/email) wajib diisi.', 'error');
    document.getElementById('postKontak')?.focus();
    return;
  }

  /* Simulate submission */
  DOM.btnSubmit.disabled = true;
  DOM.btnSubmit.innerHTML = '<i class="ti ti-loader-2 ti-spin" aria-hidden="true"></i> Mengirim...';

  setTimeout(() => {
    DOM.btnSubmit.disabled = false;
    switchModalTab(state.modalTab);
    closeModal();

    const typeLabel = state.modalTab === 'wts' ? 'WTS' : 'WTB';
    showToast(`✓ Iklan ${typeLabel} berhasil dipublikasikan!`, 'success');
  }, 1200);
}

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
let toastTimer = null;

function showToast(message, type = 'success') {
  if (!DOM.toast) return;

  DOM.toast.textContent = message;
  DOM.toast.className = 'toast show';
  if (type === 'error') DOM.toast.classList.add('error');
  if (type === 'info')  DOM.toast.classList.add('info');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 3200);
}

/* ============================================================
   EVENT LISTENERS
============================================================ */
function setupEvents() {
  /* Mode toggle */
  DOM.modeToggle?.addEventListener('click', toggleMode);
  DOM.modeToggle?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMode(); }
  });

  /* Post Iklan button */
  DOM.btnPostIklan?.addEventListener('click', openModal);

  /* Modal close button */
  DOM.modalClose?.addEventListener('click', closeModal);

  /* Close modal on overlay click */
  DOM.modalOverlay?.addEventListener('click', e => {
    if (e.target === DOM.modalOverlay) closeModal();
  });

  /* Close modal on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && DOM.modalOverlay?.style.display === 'flex') {
      closeModal();
    }
  });

  /* Search */
  setupSearch();
}

/* ============================================================
   ANIMATED STAT COUNTERS
============================================================ */
function animateCounters() {
  const counters = [
    { id: 'statWTS',    target: 2847, suffix: '' },
    { id: 'statWTB',    target: 1204, suffix: '' },
    { id: 'statVendor', target: 348,  suffix: '' },
    { id: 'statTrx',    target: 5129, suffix: '' },
  ];

  counters.forEach(({ id, target, suffix }) => {
    const el = document.getElementById(id);
    if (!el) return;

    const duration = 900;
    const step = 16;
    const steps = Math.ceil(duration / step);
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current = Math.round(easeOut(count / steps) * target);
      el.textContent = current.toLocaleString('id-ID') + suffix;
      if (count >= steps) {
        el.textContent = target.toLocaleString('id-ID') + suffix;
        clearInterval(timer);
      }
    }, step);
  });
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ============================================================
   CARD HOVER — sync blue-hover class
============================================================ */
function setupCardHoverColors() {
  document.querySelectorAll('.product-card').forEach(card => {
    const img = card.querySelector('.card-img');
    if (img && img.classList.contains('blue-bg')) {
      card.classList.add('blue-card');
    }
  });
}

/* ============================================================
   INIT
============================================================ */
function init() {
  initDarkMode();
  setupEvents();
  animateCounters();
  setupCardHoverColors();

  /* Ensure correct initial tab state */
  switchTab('wts');
}

/* Run after DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
