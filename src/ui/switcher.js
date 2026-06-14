import './switcher.css'
import { PALETTES, applyPalette } from '../config/palettes.js'
import { applyBackground }        from '../effects/backgrounds/background-manager.js'

const PALETTE_LABELS = { cyberpunk: 'Cyberpunk', matrix: 'Matrix', amber: 'Terminal', neon: 'Neon', mono: 'Mono' }
const BG_LABELS      = { grid: 'Grille', circuit: 'Circuit', topography: 'Topographie', scanlines: 'Scanlines', matrix: 'Pluie', neural: 'Réseau', void: 'Vide' }
const BG_ACCENT      = { grid: '#00cfff', circuit: '#00cfff', topography: '#a020f0', scanlines: '#2e5480', matrix: '#00ff41', neural: '#ff8800', void: '#404040' }

export function initSwitcher(ctrlBar) {
  // Theme panel
  const panel = document.createElement('div')
  panel.id = 'theme-panel'
  panel.innerHTML = `
    <div class="tp-header">
      <span class="tp-title">// SYSTÈME</span>
      <button class="tp-close" id="tp-close">&times;</button>
    </div>
    <div class="tp-section">
      <div class="tp-label">PALETTE</div>
      <div class="tp-list" id="tp-palettes">
        ${Object.keys(PALETTES).map(k => `
          <button class="tp-btn tp-palette-btn" data-palette="${k}"
            style="--preview: ${Object.values(PALETTES[k])[5]}">
            <span class="tp-swatch"></span>${PALETTE_LABELS[k]}
          </button>
        `).join('')}
      </div>
    </div>
    <div class="tp-section">
      <div class="tp-label">FOND</div>
      <div class="tp-list tp-bg-list" id="tp-bgs">
        ${Object.keys(BG_LABELS).map(k => `
          <button class="tp-btn tp-bg-btn" data-bg="${k}"
            style="--preview: ${BG_ACCENT[k]}">
            ${BG_LABELS[k]}
          </button>
        `).join('')}
      </div>
    </div>
  `
  document.body.appendChild(panel)

  // Toggle button
  const btn = document.createElement('button')
  btn.className = 'ctrl-btn'
  btn.textContent = 'THÈME'
  ctrlBar.appendChild(btn)

  btn.addEventListener('click', () => {
    panel.classList.toggle('is-open')
    btn.classList.toggle('is-active', panel.classList.contains('is-open'))
  })

  document.getElementById('tp-close').addEventListener('click', () => {
    panel.classList.remove('is-open')
    btn.classList.remove('is-active')
  })

  // Restore active states
  const activePalette = localStorage.getItem('palette') || 'cyberpunk'
  const activeBg      = localStorage.getItem('background') || 'grid'
  setActive('tp-palettes', '[data-palette]', `[data-palette="${activePalette}"]`)
  setActive('tp-bgs',      '[data-bg]',      `[data-bg="${activeBg}"]`)

  // Palette clicks
  panel.querySelector('#tp-palettes').addEventListener('click', e => {
    const btn = e.target.closest('[data-palette]')
    if (!btn) return
    applyPalette(btn.dataset.palette)
    setActive('tp-palettes', '[data-palette]', `[data-palette="${btn.dataset.palette}"]`)
  })

  // Background clicks
  panel.querySelector('#tp-bgs').addEventListener('click', e => {
    const btn = e.target.closest('[data-bg]')
    if (!btn) return
    applyBackground(btn.dataset.bg)
    setActive('tp-bgs', '[data-bg]', `[data-bg="${btn.dataset.bg}"]`)
  })
}

function setActive(containerId, allSel, activeSel) {
  const container = document.getElementById(containerId)
  container.querySelectorAll(allSel).forEach(el => el.classList.remove('is-active'))
  container.querySelector(activeSel)?.classList.add('is-active')
}
