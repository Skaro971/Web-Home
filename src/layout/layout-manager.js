import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import './layout-manager.css'
import { applyBackground } from '../effects/backgrounds/background-manager.js'

const STORAGE_KEY        = 'gs-layout'
const CUSTOM_DEFAULT_KEY = 'gs-layout-user-default'
const HIDDEN_KEY         = 'gs-hidden-widgets'
const LAYOUT_VERSION     = '8'

// 128 cols × half cell-height — same pixel dimensions as original 32-col layout
export const DEFAULT_LAYOUT = [
  { id: 'shortcuts',    x: 0,   y: 0,  w: 20, h: 36 },
  { id: 'clock',        x: 20,  y: 0,  w: 20, h: 12 },
  { id: 'pomodoro',     x: 20,  y: 12, w: 20, h: 24 },
  { id: 'search',       x: 40,  y: 0,  w: 48, h: 8  },
  { id: 'quick-links',  x: 40,  y: 8,  w: 48, h: 12 },
  { id: 'notes',        x: 40,  y: 20, w: 48, h: 16 },
  { id: 'weather',      x: 88,  y: 0,  w: 20, h: 12 },
  { id: 'rss',          x: 88,  y: 12, w: 20, h: 24 },
  { id: 'todo',         x: 108, y: 0,  w: 20, h: 36 },
]

const WIDGET_LABELS = {
  'shortcuts':    'Raccourcis',
  'clock':        'Horloge',
  'pomodoro':     'Timer',
  'search':       'Recherche',
  'quick-links':  'Liens rapides',
  'notes':        'Notes',
  'weather':      'Météo',
  'rss':          'RSS',
  'todo':         'Todo',
}

const COLS   = 128
const CELL_H = 16
const MARGIN = 6

function loadHidden()    { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]') }
function saveHidden(arr) { localStorage.setItem(HIDDEN_KEY, JSON.stringify(arr)) }

export function initLayout(ctrlBar) {
  const grid = GridStack.init({
    column:     COLS,
    cellHeight: CELL_H,
    margin:     MARGIN,
    staticGrid: true,
    float:      true,
    animate:    true,
    resizable:  { handles: 'se' },
  }, '#app')

  // Invalidate stale saved layouts on version bump
  if (localStorage.getItem('gs-layout-v') !== LAYOUT_VERSION) {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CUSTOM_DEFAULT_KEY)
    localStorage.removeItem(HIDDEN_KEY)
    localStorage.setItem('gs-layout-v', LAYOUT_VERSION)
  }

  // Load layout
  const userDefault = localStorage.getItem(CUSTOM_DEFAULT_KEY)
  grid.load(userDefault ? JSON.parse(userDefault) : DEFAULT_LAYOUT, false)
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try { grid.load(JSON.parse(saved), false) } catch (_) { /* stale */ }
  }

  // Apply hidden state on load
  loadHidden().forEach(id => {
    const el = document.getElementById(`widget-${id}`)
    if (el) el.style.display = 'none'
  })

  const app = document.getElementById('app')

  // Full-screen grid overlay (sits above widgets so grid is visible everywhere)
  const gridOverlay = document.createElement('div')
  gridOverlay.id = 'edit-grid-overlay'
  document.body.appendChild(gridOverlay)

  let editing  = false
  let prevBg   = 'grid'

  // ── Buttons ──────────────────────────────────────────────
  const editBtn = document.createElement('button')
  editBtn.className = 'ctrl-btn'
  editBtn.textContent = 'DISPOSITION'
  ctrlBar.appendChild(editBtn)

  const widgetsBtn = document.createElement('button')
  widgetsBtn.className = 'ctrl-btn'
  widgetsBtn.textContent = 'WIDGETS'
  widgetsBtn.style.display = 'none'
  ctrlBar.appendChild(widgetsBtn)

  const saveDefaultBtn = document.createElement('button')
  saveDefaultBtn.className = 'ctrl-btn'
  saveDefaultBtn.textContent = 'ENREG. DÉFAUT'
  saveDefaultBtn.style.display = 'none'
  ctrlBar.appendChild(saveDefaultBtn)

  const resetBtn = document.createElement('button')
  resetBtn.className = 'ctrl-btn'
  resetBtn.textContent = 'DÉFAUT'
  resetBtn.style.display = 'none'
  ctrlBar.appendChild(resetBtn)

  // ── Widgets panel (hidden widgets list) ──────────────────
  const widgetsPanel = document.createElement('div')
  widgetsPanel.id = 'widgets-panel'
  widgetsPanel.style.display = 'none'
  document.body.appendChild(widgetsPanel)

  function refreshWidgetsPanel() {
    const hidden = loadHidden()
    if (!hidden.length) {
      widgetsPanel.innerHTML = '<span class="widgets-panel__empty">Tous les widgets sont visibles</span>'
      return
    }
    widgetsPanel.innerHTML = hidden.map(id => `
      <button class="widgets-panel__chip" data-id="${id}">+ ${WIDGET_LABELS[id] || id}</button>
    `).join('')
    widgetsPanel.querySelectorAll('.widgets-panel__chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.id
        const el = document.getElementById(`widget-${id}`)
        if (el) el.style.display = ''
        const hidden = loadHidden().filter(h => h !== id)
        saveHidden(hidden)
        refreshWidgetsPanel()
        // Re-add ✕ button on the re-shown widget
        addCloseBtn(el, id)
      })
    })
  }

  widgetsBtn.addEventListener('click', () => {
    const open = widgetsPanel.style.display !== 'none'
    widgetsPanel.style.display = open ? 'none' : 'flex'
    widgetsBtn.classList.toggle('is-active', !open)
    if (!open) refreshWidgetsPanel()
  })

  // ── Close (✕) buttons on each widget ─────────────────────
  function addCloseBtn(el, id) {
    if (!el || el.querySelector('.widget-close-btn')) return
    const content = el.querySelector('.grid-stack-item-content') || el
    const btn = document.createElement('button')
    btn.className = 'widget-close-btn'
    btn.textContent = '✕'
    btn.title = 'Masquer le widget'
    content.appendChild(btn)
    btn.addEventListener('click', e => {
      e.stopPropagation()
      el.style.display = 'none'
      const hidden = [...new Set([...loadHidden(), id])]
      saveHidden(hidden)
      refreshWidgetsPanel()
    })
  }

  function addCloseBtns() {
    document.querySelectorAll('.grid-stack-item').forEach(el => {
      const id = el.id.replace('widget-', '')
      addCloseBtn(el, id)
    })
  }

  function removeCloseBtns() {
    document.querySelectorAll('.widget-close-btn').forEach(btn => btn.remove())
  }

  // ── Edit toggle ───────────────────────────────────────────
  editBtn.addEventListener('click', () => {
    editing = !editing
    grid.setStatic(!editing)
    app.classList.toggle('is-editing', editing)
    editBtn.textContent = editing ? 'ENREGISTRER' : 'DISPOSITION'
    editBtn.classList.toggle('is-active', editing)
    widgetsBtn.style.display    = editing ? '' : 'none'
    saveDefaultBtn.style.display = editing ? '' : 'none'
    resetBtn.style.display       = editing ? '' : 'none'

    if (editing) {
      prevBg = localStorage.getItem('background') || 'grid'
      applyBackground('void')

      // Calibrate grid lines from actual gridstack-computed inline styles
      const shortcutsEl = document.getElementById('widget-shortcuts')
      const clockEl     = document.getElementById('widget-clock')
      const pomEl       = document.getElementById('widget-pomodoro')

      const sl = parseFloat(shortcutsEl?.style.left)
      const cl = parseFloat(clockEl?.style.left)
      const ct = parseFloat(clockEl?.style.top)
      const pt = parseFloat(pomEl?.style.top)

      const offsetX = isFinite(sl) ? sl : 0
      const offsetY = isFinite(ct) ? ct : 0

      const colW = (isFinite(cl) && isFinite(sl) && cl > sl)
        ? (cl - sl) / 20
        : app.offsetWidth / COLS

      const rowH = (isFinite(pt) && isFinite(ct) && pt > ct)
        ? (pt - ct) / 12
        : CELL_H + MARGIN

      gridOverlay.style.setProperty('--edit-col-w',    `${colW}px`)
      gridOverlay.style.setProperty('--edit-cell-h',   `${rowH}px`)
      gridOverlay.style.setProperty('--edit-offset-x', `${offsetX}px`)
      gridOverlay.style.setProperty('--edit-offset-y', `${offsetY}px`)
      gridOverlay.classList.add('is-visible')
      addCloseBtns()
    } else {
      applyBackground(prevBg)
      gridOverlay.classList.remove('is-visible')
      removeCloseBtns()
      widgetsPanel.style.display = 'none'
      widgetsBtn.classList.remove('is-active')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grid.save(false)))
    }
  })

  // ── Save / Reset default ──────────────────────────────────
  saveDefaultBtn.addEventListener('click', () => {
    localStorage.setItem(CUSTOM_DEFAULT_KEY, JSON.stringify(grid.save(false)))
    saveDefaultBtn.textContent = '✓ DÉFAUT ENREG.'
    setTimeout(() => { saveDefaultBtn.textContent = 'ENREG. DÉFAUT' }, 1500)
  })

  resetBtn.addEventListener('click', () => {
    const userDef = localStorage.getItem(CUSTOM_DEFAULT_KEY)
    grid.load(userDef ? JSON.parse(userDef) : DEFAULT_LAYOUT, false)
    localStorage.removeItem(STORAGE_KEY)
  })

  return grid
}
